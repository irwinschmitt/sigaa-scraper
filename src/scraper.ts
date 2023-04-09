import { Page } from "puppeteer";
import { Department } from "./department";

export class Scraper {
  constructor() {
    // ...
  }

  public async getDepartmentPage(id: number): Promise<Page> {
    // ...

    return new Page();
  }

  public async scrapeDepartment(page: Page): Promise<Department> {
    // ...

    return new Department();
  }

  public async getDepartment(id: number): Promise<Department> {
    const departmentPage = await this.getDepartmentPage(id);
    const department = await this.scrapeDepartment(departmentPage);

    return department;
  }

  public async getComponentsSearchPage(): Promise<Page> {
    // ...

    return new Page();
  }

  public async scrapeDepartmentIds(page: Page): Promise<Set<number>> {
    // ...

    return new Set<number>();
  }

  public async getDepartmentIds(): Promise<Set<number>> {
    const componentsSearchPage = await this.getComponentsSearchPage();
    const departmentIds = await this.scrapeDepartmentIds(componentsSearchPage);

    return departmentIds;
  }

  public async getDepartments(): Promise<Department[]> {
    const departmentsIds = await this.getDepartmentIds();

    const departments = Array.from(departmentsIds).map((id) => {
      return this.getDepartment(id);
    });

    return departments;
  }
}
