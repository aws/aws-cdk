export function findV3ClientConstructor(pkg: Object) {
  const [_clientName, ServiceClient] = Object.entries(pkg).find(
    ([name]) => {
      // Services expose a base __Client class that we don't want ever
      return name.endsWith('Client') && name !== '__Client';
    },
  ) as [string, {
    new (config: any): {
      send: (command: any) => Promise<any>;
      config: any;
    };
  }];
  return ServiceClient;
}
