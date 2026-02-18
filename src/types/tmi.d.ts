declare module 'tmi.js' {
  export interface ClientOptions {
    options?: {
      debug?: boolean;
      messagesLogLevel?: string;
    };
    connection?: {
      reconnect?: boolean;
      secure?: boolean;
    };
    identity?: {
      username?: string;
      password?: string;
    };
    channels?: string[];
  }

  export interface ChatUserstate {
    'display-name'?: string;
    username?: string;
    [key: string]: any;
  }

  export interface Userstate extends ChatUserstate {}

  export class Client {
    constructor(options?: ClientOptions);
    connect(): Promise<[string, number]>;
    disconnect(): Promise<[string, number]>;
    join(channel: string): Promise<[string]>;
    part(channel: string): Promise<[string]>;
    say(channel: string, message: string): Promise<[string]>;
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback: (...args: any[]) => void): void;
    addListener(event: string, callback: (...args: any[]) => void): void;
    removeListener(event: string, callback: (...args: any[]) => void): void;
  }

  export default Client;
}
