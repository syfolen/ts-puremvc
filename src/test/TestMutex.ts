
module test {

    interface IData {

        msg: number;

        error: number;
    }

    const NAMES: string[] = [
        "sun_TO_MMI",
        "MMI_TO_MMI",
        "MSG_TO_MMI",
        "NSL_TO_MMI",
        "CUI_TO_MMI",
        "GUI_TO_MMI",
    ];

    class TestBase extends puremvc.Notifier {

        regList: string[] = [];

        ntfList: string[] = [];

        execList: string[] = [];

        constructor(msgQMod: suncore.MsgQModEnum, reverse: boolean = false) {
            super(msgQMod);
            const names: string[] = NAMES.slice();
            if (reverse === true) {
                names.reverse();
            }
            for (const name of names) {
                try {
                    this.facade.registerObserver(name, this.$func, this);
                    this.regList.push(name);
                }
                catch (error) {

                }
            }
        }

        private $func(sign: string): void {
            this.execList.push(sign);
        }

        destroy(): void {
            if (this.$destroyed === true) {
                return;
            }
            super.destroy();

            for (const name of NAMES) {
                try {
                    this.facade.removeObserver(name, this.$func, this);
                }
                catch (error) {

                }
            }
        }

        notify(): void {
            for (const name of NAMES) {
                try {
                    this.facade.sendNotification(name, name);
                    this.ntfList.push(name);
                }
                catch (error) {

                }
            }
        }
    }

    class TestKal extends TestBase {

        constructor() {
            super(suncore.MsgQModEnum.E_KAL);
        }
    }

    class TestMmi extends TestBase {

        constructor(asCUI: boolean) {
            super(suncore.MsgQModEnum.MMI, asCUI === false);
        }
    }

    class TestCui extends TestBase {

        constructor() {
            super(suncore.MsgQModEnum.CUI);
        }
    }

    class TestGui extends TestBase {

        constructor() {
            super(suncore.MsgQModEnum.GUI);
        }
    }

    class TestL4c extends TestBase {

        constructor() {
            super(suncore.MsgQModEnum.L4C);
        }
    }

    class TestNsl extends TestBase {

        constructor() {
            super(suncore.MsgQModEnum.NSL);
        }
    }

    class NslObject extends puremvc.Notifier {

        constructor() {
            super(suncore.MsgQModEnum.NSL);
            this.facade.registerObserver("NSL_TO_MMI", () => {

            }, this);
        }
    }

    class CuiObject extends puremvc.Notifier {

        constructor() {
            super(suncore.MsgQModEnum.CUI);
            this.facade.registerObserver("CUI_TO_MMI", () => {

            }, this);
        }
    }

    class GuiObject extends puremvc.Notifier {

        constructor() {
            super(suncore.MsgQModEnum.GUI);
            this.facade.registerObserver("GUI_TO_MMI", (data: IData) => {

            }, this);
        }
    }

    class MMICUIObject extends puremvc.Notifier {

        constructor() {
            super(suncore.MsgQModEnum.MMI);
            this.facade.registerObserver("MMI_TO_CUI", this.$mmiToCUI, this);
            this.facade.registerObserver("CUI_TO_MMI", this.$cuiToMMI, this);
        }

        private $mmiToCUI(data: IData): void {
            data.msg = 1;
            this.facade.sendNotification("CUI_TO_MMI", data);
        }

        private $cuiToMMI(data: IData): void {
            data.msg += 2;
            try {
                this.facade.sendNotification("GUI_TO_MMI", data);
            }
            catch (error) {
                data.error = 1;
            }
        }

        test(data: IData): void {
            this.facade.sendNotification("MMI_TO_CUI", data);
        }

        destroy(): void {
            if (this.$destroyed === true) {
                return;
            }
            super.destroy();

            this.facade.removeObserver("MMI_TO_CUI", this.$mmiToCUI, this);
            this.facade.removeObserver("CUI_TO_MMI", this.$cuiToMMI, this);
        }
    }

    class MMIGUIObject extends puremvc.Notifier {

        constructor() {
            super(suncore.MsgQModEnum.MMI);
            this.facade.registerObserver("MMI_TO_GUI", this.$mmiToGUI, this);
            this.facade.registerObserver("GUI_TO_MMI", this.$guiToMMI, this);
        }

        private $mmiToGUI(data: IData): void {
            data.msg = 1;
            this.facade.sendNotification("GUI_TO_MMI", data);
        }

        private $guiToMMI(data: IData): void {
            data.msg += 2;
            try {
                this.facade.sendNotification("CUI_TO_MMI", data);
            }
            catch (error) {
                data.error = 1;
            }
        }

        test(data: IData): void {
            this.facade.sendNotification("MMI_TO_GUI", data);
        }

        destroy(): void {
            if (this.$destroyed === true) {
                return;
            }
            super.destroy();

            this.facade.removeObserver("MMI_TO_GUI", this.$mmiToGUI, this);
            this.facade.removeObserver("GUI_TO_MMI", this.$guiToMMI, this);
        }
    }

    class TestMutexBackup extends puremvc.Notifier {

        constructor() {
            super(suncore.MsgQModEnum.MMI);
            this.facade.registerObserver("MMI_TO_GUI", this.$mmiToGUI, this);
            this.facade.registerObserver("GUI_TO_MMI", this.$guiToMMI, this);
        }

        private $mmiToGUI(data: IData): void {
            data.msg = 1;
            this.facade.sendNotification("GUI_TO_MMI", data);
        }

        private $guiToMMI(data: IData): void {
            data.msg += 2;
            try {
                puremvc.MutexLocker.backup(this);
                this.facade.sendNotification("CUI_TO_MMI", data);
                puremvc.MutexLocker.restore();
            }
            catch (error) {
                data.error = 1;
            }
        }

        test(data: IData): void {
            this.facade.sendNotification("MMI_TO_GUI", data);
        }

        destroy(): void {
            if (this.$destroyed === true) {
                return;
            }
            super.destroy();

            this.facade.removeObserver("MMI_TO_GUI", this.$mmiToGUI, this);
            this.facade.removeObserver("GUI_TO_MMI", this.$guiToMMI, this);
        }
    }

    export class TestMutex {

        constructor() {
            console.log("test mutex");
            new NslObject();
            new GuiObject();
            new CuiObject();

            let a = new MMICUIObject();
            let data: IData = { msg: 0, error: 0 };
            a.test(data);
            console.assert(data.msg === 3 && data.error === 1, `MMI层的消息传递有误 msg:${data.msg}, error:${data.error}`);
            a.destroy();

            let b = new MMIGUIObject();
            data = { msg: 0, error: 0 };
            b.test(data);
            console.assert(data.msg === 3 && data.error === 1, `MMI层的消息传递有误 msg:${data.msg}, error:${data.error}`);
            b.destroy();

            let c = new TestMutexBackup();
            data = { msg: 0, error: 0 };
            c.test(data);
            console.assert(data.msg === 3 && data.error === 0, `backup功能有误 msg:${data.msg}, error:${data.error}`);
            c.destroy();

            const kal = new TestKal();
            kal.notify();
            this.$aEqualsB(kal.ntfList, NAMES);

            let mmi = new TestMmi(true);
            this.$aEqualsB(mmi.regList, ["sun_TO_MMI", "MMI_TO_MMI", "CUI_TO_MMI"]);
            kal.notify();
            this.$aEqualsB(mmi.execList, ["sun_TO_MMI", "MMI_TO_MMI", "CUI_TO_MMI"]);
            mmi.notify();
            this.$aEqualsB(mmi.ntfList, ["sun_TO_MMI", "MMI_TO_MMI", "CUI_TO_MMI", "GUI_TO_MMI"]);
            mmi.destroy();

            mmi = new TestMmi(false);
            this.$aEqualsB(mmi.regList, ["sun_TO_MMI", "MMI_TO_MMI", "GUI_TO_MMI"]);
            kal.notify();
            this.$aEqualsB(mmi.execList, ["sun_TO_MMI", "MMI_TO_MMI", "GUI_TO_MMI"]);
            mmi.notify();
            this.$aEqualsB(mmi.ntfList, ["sun_TO_MMI", "MMI_TO_MMI", "CUI_TO_MMI", "GUI_TO_MMI"]);

            let cui = new TestCui();
            this.$aEqualsB(cui.regList, ["sun_TO_MMI", "MMI_TO_MMI", "CUI_TO_MMI"]);
            kal.notify();
            this.$aEqualsB(cui.execList, ["sun_TO_MMI", "MMI_TO_MMI", "CUI_TO_MMI"]);
            cui.notify();
            this.$aEqualsB(cui.ntfList, ["sun_TO_MMI", "MMI_TO_MMI", "CUI_TO_MMI"]);
            cui.destroy();

            let gui = new TestGui();
            this.$aEqualsB(gui.regList, ["sun_TO_MMI", "MMI_TO_MMI", "GUI_TO_MMI"]);
            kal.notify();
            this.$aEqualsB(gui.execList, ["sun_TO_MMI", "MMI_TO_MMI", "GUI_TO_MMI"]);
            gui.notify();
            this.$aEqualsB(gui.ntfList, ["sun_TO_MMI", "MMI_TO_MMI", "GUI_TO_MMI"]);
            gui.destroy();

            let l4c = new TestL4c();
            this.$aEqualsB(l4c.regList, ["sun_TO_MMI", "MSG_TO_MMI"]);
            kal.notify();
            this.$aEqualsB(l4c.execList, ["sun_TO_MMI", "MSG_TO_MMI"]);
            l4c.notify();
            this.$aEqualsB(l4c.ntfList, ["sun_TO_MMI", "MSG_TO_MMI"]);
            l4c.destroy();

            let nsl = new TestNsl();
            this.$aEqualsB(nsl.regList, ["sun_TO_MMI", "NSL_TO_MMI"]);
            kal.notify();
            this.$aEqualsB(nsl.execList, ["sun_TO_MMI", "NSL_TO_MMI"]);
            nsl.notify();
            this.$aEqualsB(nsl.ntfList, ["sun_TO_MMI", "NSL_TO_MMI"]);
            nsl.destroy();
        }

        private $check(target: Object, names: string[]): void {
            const keys: string[] = Object.keys(target).slice();

            const array: string[] = [];
            for (let i: number = 0; i < NAMES.length; i++) {
                const name: string = NAMES[i];
                if (keys.indexOf(name) > -1 && array.indexOf(name) < 0) {
                    array.push(name);
                }
            }

            this.$aEqualsB(array, names);
        }

        private $aEqualsB<T>(a: T[], b: T[]): void {
            a = a.slice();
            b = b.slice();
            a.sort();
            b.sort();
            console.assert(a.length === b.length, `当前：[${a.join(",")}], 预期：[${b.join(",")}]`);
            for (let i = 0; i < a.length; i++) {
                console.assert(a[i] === b[i], `当前：[${a.join(",")}], 预期：[${b.join(",")}]`);
            }
        }
    }
}