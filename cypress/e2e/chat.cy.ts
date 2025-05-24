/// <reference types="cypress" />

describe("Chat Application E2E - Conversation Management (with Debug Pauses)", () => {
  const GEMINI_API_ENDPOINT_REGEX =
    /https:\/\/generativelanguage\.googleapis\.com\/v1beta\/models\/gemini.*:generateContent.*/;

  // Helper function to send a message and wait for a mocked successful response
  const sendMessageAndExpectSuccess = (
    messageText: string,
    alias: string,
    conversationNumber: number
  ) => {
    cy.log(
      `Setting up SUCCESS intercept for ${alias} (Convo ${conversationNumber})`
    );
    cy.intercept("POST", GEMINI_API_ENDPOINT_REGEX, (req) => {
      const userInput =
        req.body.contents.find((c: any) => c.role === "user")?.parts[0]?.text ||
        "mocked input";
      req.reply({
        statusCode: 200,
        headers: { "Content-Type": "text/event-stream; charset=utf-8" },
        body: `data: {"candidates":[{"content":{"parts":[{"text":"Response to: "}]}}]}\ndata: {"candidates":[{"content":{"parts":[{"text":"${userInput}"}]}}]}\n`,
      });
    }).as(alias);
    cy.log(`Typing message: "${messageText}" for Convo ${conversationNumber}`);
    cy.get('textarea[placeholder="Send a message..."]', { timeout: 10000 })
      .clear()
      .type(messageText);

    cy.log(`Clicking send for message: "${messageText}"`);
    cy.get('button[aria-label="Send message"]').click();

    cy.log(`Waiting for API call @${alias}`);
    cy.wait(`@${alias}`);
    cy.contains(".flex.justify-start", `Response to: ${messageText}`, {
      timeout: 10000,
    }).should("be.visible");
    cy.get("h1.text-lg.font-semibold", { timeout: 10000 }).should(
      "contain.text",
      messageText.substring(0, 30)
    );
    cy.log(
      `Message "${messageText}" sent and response received. Title updated.`
    );
  };

  /**
   * Before each session set url to '/'
   */
  beforeEach(() => {
    cy.log("Visiting application and stubbing window.confirm");
    cy.visit("/");
    cy.on("window:confirm", () => {
      cy.log("window.confirm was called and auto-confirmed.");
      return true;
    });
  });

  /**
   * Total e2e testing
   */
  it("should allow creating multiple conversations, selecting them, and deleting one", () => {

    /**
     * First conversation
     */
    cy.log("Test Step: Creating First Conversation");
    cy.contains("button", /Start New Chat|New Chat/i, {
      timeout: 10000,
    }).click();

    cy.get("h1.text-lg.font-semibold", { timeout: 10000 })
      .invoke("text")
      .should("match", /New Chat \d{2}:\d{2}:(AM|PM)/);

    const firstConvoMessage = "Message in First Chat";
    sendMessageAndExpectSuccess(firstConvoMessage, "geminiCall1", 1);
    cy.get("aside", { timeout: 10000 })
      .find('[role="button"]')
      .contains(firstConvoMessage.substring(0, 30), { matchCase: false })
      .should("be.visible");

    cy.log("First conversation created and message sent.");

    cy.log("Test Step: Creating Second Conversation");
    
    cy.get("aside button", { timeout: 10000 })
      .contains(/New Chat/i)
      .click();

    /**
     * Second conversation
     */
    cy.get("h1.text-lg.font-semibold", { timeout: 10000 })
      .invoke("text")
      .should("match", /New Chat \d{2}:\d{2}:(AM|PM)/);

    const secondConvoMessage = "Greetings to Second Chat";

    sendMessageAndExpectSuccess(secondConvoMessage, "geminiCall2", 2);
    cy.get("aside")
      .find('[role="button"]')
      .contains(secondConvoMessage.substring(0, 30), { matchCase: false })
      .should("be.visible");

    cy.log("Second conversation created and message sent.");

    cy.log("Test Step: Verifying both conversations in sidebar");

    cy.get("aside").find('[role="button"]').should("have.length.gte", 2);

    cy.get("aside")
      .find('[role="button"]')
      .contains(firstConvoMessage.substring(0, 30), { matchCase: false });

    cy.get("aside")
      .find('[role="button"]')
      .contains(secondConvoMessage.substring(0, 30), { matchCase: false });

    cy.log("Test Step: Selecting First Conversation");

    cy.get("aside")
      .find('[role="button"]')
      .contains(firstConvoMessage.substring(0, 30), { matchCase: false })
      .click();

    cy.get("h1.text-lg.font-semibold", { timeout: 10000 }).should(
      "contain.text",
      firstConvoMessage.substring(0, 30)
    );

    cy.get(".flex.justify-end", { timeout: 10000 })
      .contains(firstConvoMessage)
      .should("be.visible");

    cy.log("First conversation selected.");

    cy.log("Test Step: Deleting Second Conversation");

    cy.get("aside")
      .find('[role="button"]')
      .contains(secondConvoMessage.substring(0, 30), { matchCase: false })
      .parent()
      .find('button[title="Delete chat"]')
      .click({ force: true });

    cy.log(
      "Delete button clicked for second conversation (window.confirm stubbed)."
    );

    cy.get("aside")
      .find('[role="button"]')
      .contains(secondConvoMessage.substring(0, 30), { matchCase: false })
      .should("not.exist");

    cy.log("Second conversation successfully deleted from sidebar.");

    cy.log("Test Step: Verifying first conversation remains");

    cy.get("aside")
      .find('[role="button"]')
      .contains(firstConvoMessage.substring(0, 30), { matchCase: false })
      .should("be.visible");
      
    cy.get("h1.text-lg.font-semibold", { timeout: 10000 }).should(
      "contain.text",
      firstConvoMessage.substring(0, 30)
    );

    cy.log("First conversation remains active.");

    cy.log("Test Step: Deleting First Conversation");

    cy.get("aside")
      .find('[role="button"]')
      .contains(firstConvoMessage.substring(0, 30), { matchCase: false })
      .parent()
      .find('button[title="Delete chat"]')
      .click({ force: true });

    cy.log("Delete button clicked for first conversation.");

    cy.contains("No chat selected.", { timeout: 10000 }).should("be.visible");

    cy.get("aside").find('[role="button"]').should("not.exist");

    cy.log("All conversations deleted, UI shows empty state.");

    
    /**
     * Last conversation to check what happens when API call fails
     */
    cy.get("aside button", { timeout: 10000 })
      .contains(/New Chat/i)
      .click();

    cy.get("h1.text-lg.font-semibold", { timeout: 10000 })
      .invoke("text")
      .should("match", /New Chat \d{2}:\d{2}:(AM|PM)/);

    const successMessage = "This message will succeed (debug)";

    sendMessageAndExpectSuccess(successMessage, "debugGeminiSuccess", 1);
    cy.log("Setting up intercept for FAILED API call");

    cy.intercept("POST", GEMINI_API_ENDPOINT_REGEX, {
      statusCode: 500,
      body: {
        error: { code: 500, message: "Simulated E2E Internal Server Error" },
      },
    }).as("debugGeminiFailure");

    const failureMessage = "This message will fail (debug)";

    cy.get('textarea[placeholder="Send a message..."]')
      .clear()
      .type(failureMessage);
      
    cy.get('button[aria-label="Send message"]').click();
    cy.contains(".flex.justify-end", failureMessage, { timeout: 10000 }).should(
      "be.visible"
    );

    cy.log("Waiting for @debugGeminiFailure");

    cy.wait("@debugGeminiFailure");

    cy.get('[data-sonner-toast][data-type="error"]', { timeout: 5000 })
      .should("be.visible")
      .and("contain.text", "AI Error");

    cy.get('.flex.justify-start div[class*="text-red-500"]', { timeout: 5000 })
      .should("be.visible")
      .and("contain.text", "Failed to load");

    cy.log("Failure UI for second message verified.");
  });
});