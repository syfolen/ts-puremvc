
module test {

    let array = [];

    export class TestPriority {

        constructor() {
            console.log("test priority");
            puremvc.Facade.getInstance().registerMediator(new CUIMediator(CUIMediator.NAME));
            puremvc.Facade.getInstance().registerCommand("CUI_TEST", TestCommand, 9);

            puremvc.Facade.getInstance().registerObserver("CUI_TEST", this.$testFwl, this, false, 7);
            puremvc.Facade.getInstance().registerObserver("CUI_TEST", this.$testEgl, this, false, 8);

            puremvc.Facade.getInstance().sendNotification("CUI_TEST");
            this.$aEqualsB(array, [
                9,
                8,
                7,
                3,
                2,
                1,
                0
            ]);

            puremvc.Facade.getInstance().removeCommand("CUI_TEST");
            puremvc.Facade.getInstance().removeObserver("CUI_TEST", this.$testFwl, this);
            puremvc.Facade.getInstance().removeObserver("CUI_TEST", this.$testEgl, this);
            puremvc.Facade.getInstance().removeMediator(CUIMediator.NAME);
        }

        private $testFwl(): void {
            array.push(7);
        }

        private $testEgl(): void {
            array.push(8);
        }

        private $aEqualsB(a: number[], b: number[]): void {
            for (let i = 0; i < a.length; i++) {
                console.assert(a[i] === b[i], `当前：[${a.join(",")}], 预期：[${b.join(",")}]`);
            }
        }
    }

    class CUIMediator extends puremvc.Mediator {

        static readonly NAME: string = "CUIMediator";

        onRegister(): void {
            TestView.count++;
        }

        onRemove(): void {
            TestView.count++;
        }

        listNotificationInterests(): void {
            this.$handleNotification("CUI_TEST", this.$testLowest, 0);
            this.$handleNotification("CUI_TEST", this.$testLow, 1);
            this.$handleNotification("CUI_TEST", this.$testMid, 2);
            this.$handleNotification("CUI_TEST", this.$testHigh, 3);
        }

        private $testHigh(): void {
            array.push(3);
        }

        private $testMid(): void {
            array.push(2);
        }

        private $testLow(): void {
            array.push(1);
        }

        private $testLowest(): void {
            array.push(0);
        }
    }

    class TestCommand extends puremvc.SimpleCommand {

        execute(): void {
            array.push(9);
        }
    }
}