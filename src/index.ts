import { Scraper } from "./scraper";

(async () => {
  const scraper = new Scraper();

  const departments = await scraper.getDepartments();
})();
