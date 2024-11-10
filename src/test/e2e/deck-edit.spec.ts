import test, { type Page, expect } from "@playwright/test";
import { fillSearch, importDeckFromFile } from "./actions";
import { mockApiCalls } from "./mocks";

test.beforeEach(async ({ page }) => {
  await mockApiCalls(page);
});

async function sumCardCounts(page: Page) {
  const elements = await page
    .getByTestId("editor-tabs-slots")
    .getByTestId("quantity-value")
    .all();

  let sum = 0;

  for (const el of elements) {
    const text = await el.innerText();
    sum += Number.parseInt(text, 10);
  }

  return sum;
}

test.describe("deck edit", () => {
  test("draw random basic weakness", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("collection-create-deck").click();

    await fillSearch(page, "subject");

    await page
      .getByTestId("listcard-89001")
      .getByTestId("create-choose-investigator")
      .click();

    await page.getByTestId("create-save").click();

    await expect(page.getByTestId("editor-tabs-slots")).toBeVisible();

    await expect(
      page.getByTestId("listcard-01000").getByTestId("quantity-value"),
    ).toContainText("2");

    expect(await sumCardCounts(page)).toEqual(9);

    await page.getByTestId("draw-basic-weakness").click();

    await expect(
      page.getByTestId("listcard-01000").getByTestId("quantity-value"),
    ).toContainText("1");

    expect(await sumCardCounts(page)).toEqual(9);

    await page.getByTestId("draw-basic-weakness").click();

    await expect(
      page.getByTestId("listcard-01000").getByTestId("quantity-value"),
    ).toContainText("0");

    expect(await sumCardCounts(page)).toEqual(9);
  });

  test("customizable deck limits (honed instinct)", async ({ page }) => {
    await importDeckFromFile(page, "validation/honed_instinct_valid.json", {
      navigate: "edit",
    });

    await expect(page.getByTestId("decklist-validation")).not.toBeVisible();

    // open honed instinct card modal.
    await page
      .getByTestId("listcard-09061")
      .getByTestId("listcard-title")
      .click();

    // deselect last xp and close modal. (deck_limit 3 => 2)
    await page.getByTestId("customization-6-xp-2").click();
    await page.getByTestId("card-modal").press("Escape");

    await expect(page.getByTestId("decklist-validation")).toBeVisible();

    // decrement honed instinct quantity.
    await page
      .getByTestId("listcard-09061")
      .getByTestId("quantity-decrement")
      .click();

    // increment a one-off to get back to 30 cards.
    await page
      .getByTestId("listcard-01086")
      .getByTestId("quantity-increment")
      .click();

    await expect(page.getByTestId("decklist-validation")).not.toBeVisible();
  });

  test("move to main deck", async ({ page }) => {
    await importDeckFromFile(page, "validation/honed_instinct_valid.json", {
      navigate: "edit",
    });

    await expect(
      page.getByTestId("editor-tabs-slots").getByTestId("listcard-02229"),
    ).not.toBeVisible();

    await page.getByTestId("editor-tab-sideslots").click();

    await fillSearch(page, "quick thinking");

    await page
      .getByTestId("listcard-02229")
      .getByTestId("quantity-increment")
      .click();
    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-02229")
      .getByTestId("quantity-increment")
      .dblclick();
    await page.getByTestId("editor-move-to-main").click();
    await page.getByTestId("editor-move-to-main").click();

    await page.getByTestId("editor-tab-slots").click();
    await expect(
      page
        .getByTestId("editor-tabs-slots")
        .getByTestId("listcard-02229")
        .getByTestId("quantity-value"),
    ).toContainText("2");
  });

  test("transformed investigators", async ({ page }) => {
    await importDeckFromFile(page, "ythian.json", {
      navigate: "edit",
    });

    await fillSearch(page, "flashlight");
    await expect(page.getByTestId("cardlist-count")).toContainText("0 cards");

    await fillSearch(page, "maimed hand");
    await expect(page.getByTestId("cardlist-count")).toContainText("1 cards");

    await expect(
      page.getByTestId("listcard-01087").getByTestId("quantity-value"),
    ).toBeVisible();

    await expect(
      page.getByTestId("listcard-01087").getByTestId("quantity-increment"),
    ).not.toBeVisible();

    await expect(
      page.getByTestId("listcard-02039").getByTestId("quantity-increment"),
    ).toBeVisible();
  });

  test("add campaign card", async ({ page }) => {
    await importDeckFromFile(page, "validation/honed_instinct_valid.json", {
      navigate: "edit",
    });
    await page.getByTestId("card-type-encounter").click();
    await page
      .getByTestId("listcard-01117")
      .getByTestId("quantity-increment")
      .click();
    await expect(
      page
        .getByTestId("editor-tabs-slots")
        .getByTestId("listcard-01117")
        .getByTestId("quantity-value"),
    ).toContainText("1");
  });

  test("add advanced signature", async ({ page }) => {
    await importDeckFromFile(page, "validation/honed_instinct_valid.json", {
      navigate: "edit",
    });

    await page.getByTestId("search-game-text").click();
    await fillSearch(page, "Advanced.");

    await page
      .getByTestId("listcard-90009")
      .getByTestId("quantity-increment")
      .click();

    await page
      .getByTestId("listcard-90010")
      .getByTestId("quantity-increment")
      .click();

    await expect(
      page
        .getByTestId("editor-tabs-slots")
        .getByTestId("listcard-90010")
        .getByTestId("quantity-value"),
    ).toContainText("1");

    await expect(
      page
        .getByTestId("editor-tabs-slots")
        .getByTestId("listcard-90009")
        .getByTestId("quantity-value"),
    ).toContainText("1");
  });

  test("signature -> signature relation", async ({ page }) => {
    await importDeckFromFile(page, "validation/honed_instinct_valid.json", {
      navigate: "edit",
    });

    await page
      .getByTestId("listcard-01010")
      .getByTestId("listcard-title")
      .click();

    await expect(
      page.getByTestId("cardset-otherSignatures").getByTestId("listcard-90009"),
    ).toBeVisible();

    await page
      .getByTestId("cardset-otherSignatures")
      .getByTestId("listcard-90009")
      .getByTestId("listcard-title")
      .click();

    await expect(
      page.getByTestId("cardset-otherSignatures").getByTestId("listcard-01010"),
    ).toBeVisible();
  });
});
