import { RelUiAdminPage } from './app.po';

describe('Rel UI-admin App', () => {
  let page: RelUiAdminPage;

  beforeEach(() => {
    page = new RelUiAdminPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
