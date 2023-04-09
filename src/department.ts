export class Department {
  private id: number;
  private acronym: string;
  private title: string;

  constructor(id: number, acronym: string, title: string) {
    this.id = id;
    this.acronym = acronym;
    this.title = title;
  }
}
