/// <reference lib="webworker" />

export {};

declare global {
  interface ServiceWorkerGlobalScope {
    addEventListener(
      type: "install" | "activate" | "fetch",
      listener: (
        this: ServiceWorkerGlobalScope,
        ev: ExtendableEvent | FetchEvent
      ) => any
    ): void;
  }

  interface ExtendableEvent extends Event {
    waitUntil(promise: Promise<any>): void;
  }

  interface FetchEvent extends ExtendableEvent {
    readonly request: Request;
    respondWith(response: Response | Promise<Response>): void;
  }

  let self: ServiceWorkerGlobalScope;
}
