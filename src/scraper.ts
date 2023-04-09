import puppeteer, {
  Browser,
  Page,
  PuppeteerNodeLaunchOptions,
} from "puppeteer";
import { Department } from "./department";

export class Scraper {
  private browser: Browser;
  private baseUrl = "https://sigaa.unb.br/sigaa/public";

  private constructor(browser: Browser) {
    this.browser = browser;
  }

  public static async init(
    options?: PuppeteerNodeLaunchOptions
  ): Promise<Scraper> {
    const browser = await puppeteer.launch(options);

    const scraper = new Scraper(browser);

    const [page] = await scraper.browser.pages();
    await page.goto(scraper.baseUrl);
    await page.close();

    return scraper;
  }

  public getBrowser(): Browser {
    return this.browser;
  }

  public async getDepartmentPage(id: number): Promise<Page> {
    const page = await this.browser.newPage();
    await page.goto(`${this.baseUrl}/departamento/portal.jsf?id=${id}`);

    return page;
  }

  public async scrapeDepartment(page: Page): Promise<Department | null> {
    const url = new URL(page.url()).searchParams.get("id");

    if (!url) {
      return null;
    }

    const id = parseInt(url);

    const acronym = await page.$eval(
      "#colDirTop h1",
      (element) => element.textContent
    );

    if (!acronym) {
      return null;
    }

    const title = await page.$eval(
      "#colDirTop h2",
      (element) => element.textContent
    );

    if (!title) {
      return null;
    }

    return new Department(id, acronym, title);
  }

  public async getDepartment(id: number): Promise<Department | null> {
    const departmentPage = await this.getDepartmentPage(id);
    const department = await this.scrapeDepartment(departmentPage);

    if (!department) {
      return null;
    }

    await departmentPage.close();

    return department;
  }

  public async getComponentsSearchPage(): Promise<Page> {
    const page = await this.browser.newPage();

    await page.goto(`${this.baseUrl}/componentes/busca_componentes.jsf`);

    return page;
  }

  public async scrapeDepartmentIds(page: Page): Promise<Set<number>> {
    const departmentIds = await page.$$eval(
      "select[id='form:unidades'] option",
      (options) => {
        return options
          .map((option) => parseInt(option.value))
          .filter((id) => id > 0);
      }
    );

    return new Set<number>(departmentIds);
  }

  public async getDepartmentIds(): Promise<Set<number>> {
    const componentsSearchPage = await this.getComponentsSearchPage();
    const departmentIds = await this.scrapeDepartmentIds(componentsSearchPage);

    await componentsSearchPage.close();

    return departmentIds;
  }

  public async getDepartments(): Promise<Department[]> {
    const departmentsIds = await this.getDepartmentIds();

    const departmentsPromises = Array.from(departmentsIds).map((id) => {
      return this.getDepartment(id);
    });

    const departments = await Promise.all(departmentsPromises);

    const filteredDepartments = departments.filter(
      (department): department is Department => {
        return department !== null;
      }
    );

    return filteredDepartments;
  }
}
