export const EventMap = {
  ImgOnload: "ImgOnload",
} as const;

type Event = typeof EventMap[keyof typeof EventMap];
type Listener = () => void;

class EdisonEventListener {
  listeners: Map<Event, Listener[]>;
  constructor() {
    this.listeners = new Map();
  }

  addEventListener = (event: Event, listener: Listener) => {
    const oldList = this.listeners.get(event) || [];
    const newList = [...oldList, listener];
    this.listeners.set(event, newList);
  };

  emitEvent = (event: Event) => {
    const listenerList = this.listeners.get(event) || [];
    listenerList.forEach((cb) => {
      cb();
    });
  };
}

export const EventListener = new EdisonEventListener();
