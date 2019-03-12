import {
  ObservableQuery,
  OperationVariables,
  ApolloQueryResult
} from "apollo-boost";

import { BehaviorSubject, Observable } from "rxjs";
import { share } from "rxjs/operators";

export enum HandlerAction {
  INITIAL,
  LOADING,
  LOADED,
  CANCELLED,
  RETRYING,
  STOPPED,
  DISPOSED,
  NODATA,
  ERROR,
  NONE,
  INTERMEDIATE
}

class HandlerState {
  public isDirty: boolean = false;
  private state: HandlerAction;
  public onChange$: Observable<HandlerAction>;
  private onChangeSubject: BehaviorSubject<HandlerAction>;

  constructor(state: HandlerAction = HandlerAction.NONE) {
    this.state = state;
    this.onChangeSubject = new BehaviorSubject(this.state);
    this.onChange$ = this.onChangeSubject.asObservable().pipe(share());
  }

  public get initial(): boolean {
    return this.state === HandlerAction.INITIAL;
  }
  public get loading(): boolean {
    return this.state === HandlerAction.LOADING;
  }
  public get loaded(): boolean {
    return this.state === HandlerAction.LOADED;
  }
  public get cancelled(): boolean {
    return this.state === HandlerAction.CANCELLED;
  }
  public get none(): boolean {
    return this.state === HandlerAction.NONE;
  }
  public get intermediate(): boolean {
    return this.state === HandlerAction.INTERMEDIATE;
  }
  public get retrying(): boolean {
    return this.state === HandlerAction.RETRYING;
  }
  public get stopped(): boolean {
    return this.state === HandlerAction.STOPPED;
  }
  public get disposed(): boolean {
    return this.state === HandlerAction.DISPOSED;
  }
  public get nodata(): boolean {
    return this.state === HandlerAction.NODATA;
  }
  public get error(): boolean {
    return this.state === HandlerAction.ERROR;
  }

  public getState(): HandlerAction {
    return this.state;
  }

  public dispatch(state: HandlerAction): void {
    if (this.state !== state) {
      this.isDirty = true;
      this.state = state;
      this.onChangeSubject.next(this.state);
    }
  }
}

export class StateHandler<T = null, TVariable = OperationVariables> {
  public readonly state: HandlerState;
  public resolve: ObservableQuery<T, TVariable>;
  public error?: any;

  public value: ApolloQueryResult<T | undefined> | null;

  constructor(
    resolve: ObservableQuery<T, TVariable>,
    initialState?: HandlerAction,
    error?: any
  ) {
    this.resolve = resolve;
    this.value = null;
    this.state = new HandlerState(initialState);
    this.error = error;
  }

  public dispatch(state: HandlerAction): void {
    if (this.state) {
      this.state.dispatch(state);
    }
  }

  public async fetch() {
    try {
      this.dispatch(HandlerAction.LOADING);
      const value = await this.resolve.result();

      this.value = value;
      this.dispatch(HandlerAction.LOADED);
    } catch (error) {
      this.error = error;
      this.dispatch(HandlerAction.ERROR);
    }
  }
}

export const requestHandler = <T = null, TVariable = OperationVariables>(
  resolve: ObservableQuery<T, TVariable>,
  initialState?: HandlerAction
) => new StateHandler(resolve, initialState);
