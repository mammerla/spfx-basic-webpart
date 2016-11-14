// Setup mock Http client
import { ISPIssue } from '../ISPIssueList';
export default class MockIssueListHttpClient {
    private static _items: ISPIssue[] = [{ Title: 'Mock Issue List', Description: '1' }];
    public static get(restUrl: string, options?: any): Promise<ISPIssue[]> {
      return new Promise<ISPIssue[]>((resolve) => {
            resolve(MockIssueListHttpClient._items);
        });
    }
}
