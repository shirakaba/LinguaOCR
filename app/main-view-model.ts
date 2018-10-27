/// <reference path="../node_modules/nativescript-http-server/typings/objc!GCDWebServer.d.ts" />

import { Observable } from 'data/observable';
import { HttpServer } from 'nativescript-http-server';
import {WebView, LoadEventData} from "tns-core-modules/ui/web-view";


export class HelloWorldModel extends Observable {

    private _counter: number;
    private _message: string;

    constructor() {
        super();

        // Initialize default values.
        this._counter = 42;
        this.updateMessage();

        const httpServer: GCDWebServer = new HttpServer()._webServer;

        httpServer.addGETHandlerForBasePathDirectoryPathIndexFilenameCacheAgeAllowRangeRequests(
            // "/www/",
            "/",
            `${NSBundle.mainBundle.resourcePath}/app/www`, // NSHomeDirectory()
            null,
            3600,
            true
        );

        // Check Bonjour services via: dns-sd -B 
        // http://hints.macworld.com/article.php?story=20051026183044858
        httpServer.startWithPortBonjourName(6060, "GCD Web Server");
        /* TODO:
         * - Init a WebView pointing at http://localhost:6060/index.html
         * - Leave image.jpeg unwritten at start
         * - Implement an image picker.
         * - Implement a language pack downloader.
         * - Provide a way to overwrite `${NSBundle.mainBundle.resourcePath}/www/image.jpeg`.
         * - Provide a button for launching OCR (caution if image.jpeg isn't present)
         * - Provide a view for displaying results.
         * - Provide a way to re-select port number?
         * - tns platform remove ios; tns plugin add nativescript-http-server; tns run ios
        */
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
