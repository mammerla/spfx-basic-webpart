// Setup mock Http client
import { ISPList } from '../ISPListList';
export default class MockListListHttpClient {
    private static _items: ISPList[] = [{ Title: 'Mock Issue List', Description: '1' }];
    public static get(restUrl: string, options?: any): Promise<ISPList[]> {
      return new Promise<ISPList[]>((resolve) => {
            resolve(MockListListHttpClient._items);
        });
    }
}
