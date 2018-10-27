/// <reference path="../node_modules/nativescript-http-server/typings/objc!GCDWebServer.d.ts" />

import { Observable } from 'data/observable';

// import { GCDWebServer } from 'nativescript-http-server/typings/objc!GCDWebServer.d.ts';
// import { GCDWebServer } from 'nativescript-http-server';
// import { GCDWebServerCopy } from 'nativescript-http-server';
// import { GCDWebServerInstance } from 'nativescript-http-server';
// const $GCDWebServer: GCDWebServer = require("GCDWebServer");

import { HttpServer } from 'nativescript-http-server';

export class HelloWorldModel extends Observable {

    private _counter: number;
    private _message: string;

    constructor() {
        super();

        // Initialize default values.
        this._counter = 42;
        this.updateMessage();

        // const GCDWebServer = require("GCDWebServer");
        // const webServer = GCDWebServerInstance.alloc().init();
        // const webServer = GCDWebServer.alloc().init();
        // GCDWebServerInstance.addGETHandlerForBasePathDirectoryPathIndexFilenameCacheAgeAllowRangeRequests
        // GCDWebServerInstance.start();

        const httpServer: GCDWebServer = new HttpServer()._webServer;
        // let localUrl = httpServer.serveWithHtml("<html><body><p>Hello World</p></body></html>");

        // GCDWebServerInstance.addDefaultHandlerForMethodRequestClassAsyncProcessBlock("GET", GCDWebServerRequest, (request,completionBlock) => {
        //     var response = GCDWebServerDataResponse.alloc().initWithHTML("some html string");
        //     completionBlock(response);
        // });
        
        
        // webServer.start();
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
