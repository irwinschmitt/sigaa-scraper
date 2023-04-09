import { Scraper } from "./scraper";

(async () => {
  const scraper = await Scraper.init();

  // const departments = await scraper.getDepartments();
  const department = await scraper.getDepartment(673);

  console.log(department);
  // console.log(departments);

  await scraper.getBrowser().close();
})();
