
module puremvc {
    /**
     * 视图类（视图集合）
     */
    export interface IView {

        registerObserver(name: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: number, args?: any[]): IObserver;

        removeObserver(name: string, method: Function, caller: Object): void;

        hasObserver(name: string, method: Function, caller: Object): boolean;

        notifyObservers(name: string, data?: any, cancelable?: boolean): void;

        notifyCancel(): void;

        registerMediator(mediator: IMediator<any>): void;

        removeMediator(name: string): void;

        retrieveMediator(name: string): IMediator<any>;

        hasMediator(name: string): boolean;
    }

}