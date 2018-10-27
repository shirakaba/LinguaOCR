import {Observable} from "tns-core-modules/data/observable";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {WebView, LoadEventData} from "tns-core-modules/ui/web-view";
import { Page } from "tns-core-modules/ui/page";
import { TextField } from "tns-core-modules/ui/text-field";

export class wv extends Observable {
    private _tftext: string = "https://docs.nativescript.org/";
    private _result: string = "";
    private _webViewSrc: string = "https://docs.nativescript.org/";

    get tftext(): string { return this._tftext; }
    get result(): string { return this._result; }
    get webViewSrc(): string { return this._webViewSrc; }
    
    set tftext(value: string) {
        if (this._tftext === value) return;
        this._tftext = value;
        this.notifyPropertyChange('tftext', value);
    }
    
    set result(value: string) {
        if (this._result === value) return;
        this._result = value;
        this.notifyPropertyChange('result', value);
    }    
    
    set webViewSrc(value: string) {
        if (this._webViewSrc === value) return;
        this._webViewSrc = value;
        this.notifyPropertyChange('webViewSrc', value);
    }

    constructor() {
        super();
        // const httpServer: GCDWebServer = new HttpServer()._webServer;

        // httpServer.addGETHandlerForBasePathDirectoryPathIndexFilenameCacheAgeAllowRangeRequests(
        //     // "/www/",
        //     "/",
        //     `${NSBundle.mainBundle.resourcePath}/app/www`, // NSHomeDirectory()
        //     null,
        //     3600,
        //     true
        // );

        // // Check Bonjour services via: dns-sd -B 
        // // http://hints.macworld.com/article.php?story=20051026183044858
        // httpServer.startWithPortBonjourName(6060, "GCD Web Server");
        // /* TODO:
        //  * - Init a WebView pointing at http://localhost:6060/index.html
        //  * - Leave image.jpeg unwritten at start
        //  * - Implement an image picker.
        //  * - Implement a language pack downloader.
        //  * - Provide a way to overwrite `${NSBundle.mainBundle.resourcePath}/www/image.jpeg`.
        //  * - Provide a button for launching OCR (caution if image.jpeg isn't present)
        //  * - Provide a view for displaying results.
        //  * - Provide a way to re-select port number?
        //  * - tns platform remove ios; tns plugin add nativescript-http-server; tns run ios
        // */
    }

    navigatingTo(args) {
        console.log("navigatingTo();");

        this.set("webViewSrc", "https://docs.nativescript.org/");
        this.set("result", "");
        this.set("tftext", "https://docs.nativescript.org/");
        const page: Page = <Page> args.object;
        page.bindingContext = this;
    }

    // handling WebView load finish event
    onWebViewLoaded(webargs) {
        console.log("onWebViewLoaded();");
        const page: Page = <Page> webargs.object.page;
        const webview: WebView = <WebView> webargs.object;
        this.set("result", "WebView is still loading...");
        this.set("enabled", false);

        webview.on(WebView.loadFinishedEvent, (args: LoadEventData) => {
            let message = "";
            if (!args.error) {
                message = `WebView finished loading of ${args.url}`;
            } else {
                message = `Error loading ${args.url} : ${args.error}`;
            }

            this.set("result", message);
            console.log(`WebView message - ${message}`);
        });
    }
    // going to the previous page if such is available
    goBack(args) {
        console.log("goBack();");
        const page: Page = <Page> args.object.page;
        const webview: WebView = <WebView> page.getViewById("wv");
        if (webview.canGoBack) {
            webview.goBack();
            this.set("enabled", true);
        }
    }
    // going forward if a page is available
    goForward(args) {
        console.log("GO FORWARD");
        const page: Page = <Page> args.object.page;
        const webview: WebView = <WebView> page.getViewById("wv");
        if (webview.canGoForward) {
            webview.goForward();
        } else {
            this.set("enabled", false);
        }
    }
    // changing WebView source
    submit(args) {
        const page: Page = <Page> args.object.page;
        const textField: TextField = <TextField> args.object;
        const text = textField.text;
        this.set("enabled", false);
        if (text.substring(0, 4) === "http") {
            this.set("webViewSrc", text);
            textField.dismissSoftInput();
        } else {
            dialogs.alert("Please, add `http://` or `https://` in front of the URL string")
            .then(() => {
                console.log("Dialog closed!");
            });
        }
    }

}