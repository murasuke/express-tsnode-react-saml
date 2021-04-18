import { getSearchResults } from "../utils/api";

describe("SearchResultList", () =>{
  test("", async () => {
    const searchResult = await getSearchResults();
    expect( searchResult.length).toBe(20);
  });
});