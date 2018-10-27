/// <reference path="../node_modules/nativescript-http-server/typings/objc!GCDWebServer.d.ts" />

import { Observable } from 'data/observable';
import { HttpServer } from 'nativescript-http-server';

export class HelloWorldModel extends Observable {

    private _counter: number;
    private _message: string;

    constructor() {
        super();

        // Initialize default values.
        this._counter = 42;
        this.updateMessage();

        // NSBundle.mainBundle.resourcePath
        // NSBundle.mainBundle.pathForResourceOfType("whatever", "js")

        const httpServer: GCDWebServer = new HttpServer()._webServer;
        // httpServer.addDefaultHandlerForMethodRequestClassAsyncProcessBlock(
        //     "GET",
        //     GCDWebServerRequest as any,
        //     (request, completionBlock) => {
        //         const response = GCDWebServerDataResponse.alloc()
        //         .initWithHTML("<html><body><p>Hello World</p></body></html>");

        //         return completionBlock(response);
        //     }
        // );

        httpServer.addGETHandlerForBasePathDirectoryPathIndexFilenameCacheAgeAllowRangeRequests(
            // "/www/",
            "/",
            `${NSBundle.mainBundle.resourcePath}/www`, // NSHomeDirectory()
            null,
            3600,
            true
        );

        // Check Bonjour services via: dns-sd -B 
        // http://hints.macworld.com/article.php?story=20051026183044858
        httpServer.startWithPortBonjourName(6060, "GCD Web Server");
    }

    get message(): string {
        return this._message;
    }
    
    set message(value: string) {
        if (this._message !== value) {
            this._message = value;
            this.notifyPropertyChange('message', value)
        }
    }

    public onTap() {
        this._counter--;
        this.updateMessage();
    }

    private updateMessage() {
        if (this._counter <= 0) {
            this.message = 'Hoorraaay! You unlocked the NativeScript clicker achievement!';
        } else {
            this.message = `${this._counter} taps left`;
        }
    }
}
