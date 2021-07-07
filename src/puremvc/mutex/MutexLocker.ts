
module puremvc {
    /**
     * 互斥锁，用于实现模块之间的消息互斥
     * export
     */
    export namespace MutexLocker {
        /**
         * MMI通用消息前缀
         */
        export const MMI_COMMAND_PREFIX: string = "MMI";

        /**
         * 系统消息前缀（通用消息）
         */
        export const KERNEL_COMMAND_PREFIX: string = "sun";

        /**
         * MsgQ消息传递作用域
         */
        export let scope: MutexScope = null;

        /**
         * MsgQ消息监听互斥锁
         */
        export let locker: MutexScope = null;

        /**
         * 是否校验消息前缀，默认为false
         */
        export let checkPrefix: boolean = false;

        /**
         * MsgQ模块集
         */
        export const msgQMap: suncom.KVString2Object<suncore.MsgQModEnum> = {};

        /**
         * MsgQ模块前缀集
         */
        export const msgQCmd: suncom.KVNumber2String = {};

        /**
         * 表现层MsgQ模块集
         */
        export const mmiMsgQMap: suncom.KVNumber2Boolean = {};

        /**
         * 获取命令前缀
         */
        function getCommandPrefix(name: string): string {
            if (name.substr(0, 3) === KERNEL_COMMAND_PREFIX) {
                return KERNEL_COMMAND_PREFIX;
            }
            const index: number = name.indexOf("_");
            if (index < 1) {
                throw Error(`必须为命令指定一个模块名，格式如 MOD_${name}`);
            }
            const prefix: string = name.substr(0, index);
            if (msgQMap[prefix] === void 0) {
                throw Error(`未注册的MsgQ消息前缀：${prefix}`);
            }
            return prefix;
        }

        /**
         * 判断是否允许执行MMI的行为
         */
        export function enableMMIAction(): boolean {
            if (checkPrefix === false) {
                return true;
            }
            if (scope.curMsgQMod === suncore.MsgQModEnum.E_NIL || scope.curMsgQMod === suncore.MsgQModEnum.E_KAL || scope.curMsgQMod === suncore.MsgQModEnum.MMI) {
                return true;
            }
            return mmiMsgQMap[scope.curMsgQMod] === true;
        }

        /**
         * 激活互斥体
         */
        export function active(msgQMod: suncore.MsgQModEnum): void {
            if (checkPrefix === true) {
                scope.active(msgQMod);
            }
        }

        /**
         * 关闭互斥体
         */
        export function deactive(): void {
            if (checkPrefix === true) {
                scope.deactive();
            }
        }

        /**
         * 锁定互斥体
         */
        export function lock(name: string): void {
            if (checkPrefix === false) {
                return;
            }
            const prefix: string = getCommandPrefix(name);
            const msgQMod: suncore.MsgQModEnum = msgQMap[prefix];

            scope.asserts(msgQMod, null);
            scope.lock(msgQMod);
        }

        /**
         * 释放互斥体
         */
        export function unlock(name: string): void {
            if (checkPrefix === false) {
                return;
            }
            const prefix: string = getCommandPrefix(name);
            const msgQMod: suncore.MsgQModEnum = msgQMap[prefix];

            scope.asserts(msgQMod, null);
            scope.unlock(msgQMod);
        }

        /**
         * 为对象初始化一个互斥量
         */
        export function create(name: string, target: Object): void {
            if (checkPrefix === false) {
                return;
            }
            if (target === null || target === Controller.inst || target === View.inst) {
                return;
            }

            const prefix: string = getCommandPrefix(name);
            const msgQMod: suncore.MsgQModEnum = msgQMap[prefix];

            locker.update(target);
            locker.asserts(msgQMod, target);
            locker.lock(msgQMod);
        }

        /**
         * 释放互斥量
         */
        export function release(name: string, target: Object): void {
            if (checkPrefix === false) {
                return;
            }
            if (target === null || target === Controller.inst || target === View.inst) {
                return;
            }

            const prefix: string = getCommandPrefix(name);
            const msgQMod: suncore.MsgQModEnum = msgQMap[prefix];

            locker.update(target);
            locker.asserts(msgQMod, target);
            locker.unlock(msgQMod);
        }

        /**
         * 备份快照，并锁定target指定的模块
         * export
         */
        export function backup(target: Object): void {
            if (checkPrefix === true) {
                scope.backup(target);
            }
        }

        /**
         * 恢复快照中的数据（自动从上次备份的快照中获取）
         * export
         */
        export function restore(): void {
            if (checkPrefix === true) {
                scope.restore();
            }
        }
    }
}