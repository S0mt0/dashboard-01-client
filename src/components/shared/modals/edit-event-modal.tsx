import { v4 as EventId } from "uuid";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { PencilLine } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  TEvent,
  isEventErrors,
  resetErrors,
  useShipmentEventsInputValidation,
} from "../../../../sdk";

export function EditEventModal(props: {
  shipmentEvent: TEvent;
  whatToDo: "edit" | "add";
  resetEventModal: () => void;
  handleEventSubmission: () => void;
  setShipmentEvent: Dispatch<SetStateAction<TEvent>>;
  handleShipmentEventChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  toggleMode: (type: "add" | "edit", eventId?: string) => void;
  eventId: string;
}) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /** When modal mounts and its function is to add a new event (i.e. whatToDo==="add"), then assign a "eventId" to the new event already */
  useEffect(() => {
    let isMounted = true;
    const eventId = EventId();

    isMounted &&
      props.whatToDo === "add" &&
      props.setShipmentEvent((prevEvent) => ({
        ...prevEvent,
        eventId,
      }));

    return () => {
      isMounted = false;
    };
  }, [props.whatToDo]);

  // input validation
  const {
    handleEventInputBlur,
    canEventBeSubmitted,
    eventErrors,
    setEventErrors,
  } = useShipmentEventsInputValidation();

  /** On mount, enable button if the function of the modal is to edit an event */
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (props.whatToDo === "edit") {
        resetErrors(setEventErrors, eventErrors);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [props.whatToDo]);

  if (!isMounted) return null;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="bg-transparent outline-none border-none"
          onClick={() => props.toggleMode("edit", props.eventId)}
        >
          <PencilLine className="mr-[3px] h-4 w-4 text-slate-700" />
        </button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] w-[90%]"
        resetEventModal={props.resetEventModal}
      >
        <DialogHeader>
          <DialogTitle>Edit Event </DialogTitle>
          <DialogDescription>
            Add to your shipment events here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-4">
          <p className="flex-1 flex flex-col w-full gap-2 text-sm font-medium text-neutral-800 items-start">
            <label htmlFor="eventTimestamp">Timestamp:</label>
            <input
              onBlur={(e) => handleEventInputBlur(e)}
              type="datetime-local"
              name="timestamp"
              id="eventTimestamp"
              value={props.shipmentEvent.timestamp}
              onChange={(e) => props.handleShipmentEventChange(e)}
              className={cn(
                "w-full p-2 outline-none border border-orange-200/80 max-w-full bg-white text-black focus:ring-2 focus-visible:ring-2 focus:ring-orange-400/75 ",
                isEventErrors(eventErrors) &&
                  eventErrors.timestamp.showErrorMessage &&
                  "outline-2 outline-red-400"
              )}
              required
              aria-required
              autoFocus={false}
            />
          </p>
          <p className="flex-1 flex flex-col w-full gap-2 text-sm font-medium text-neutral-800 items-start">
            <label htmlFor="eventLocation">Location:</label>

            <input
              onBlur={(e) => handleEventInputBlur(e)}
              type="text"
              name="eventLocationAddress"
              id="eventLocation"
              value={props.shipmentEvent.location.address.addressLocality}
              onChange={(e) => props.handleShipmentEventChange(e)}
              className={cn(
                "w-full p-2 outline-none border border-orange-200/80 max-w-full bg-white text-black focus:ring-2 focus-visible:ring-2 focus:ring-orange-400/75 ",
                isEventErrors(eventErrors) &&
                  eventErrors.location.showErrorMessage &&
                  "outline-2 outline-red-400"
              )}
              required
              aria-required
              autoFocus={false}
            />
          </p>
          <p className="flex-1 flex flex-col w-full gap-2 text-sm font-medium text-neutral-800 items-start">
            <label htmlFor="eventDescription">Description:</label>

            <textarea
              onBlur={(e) => handleEventInputBlur(e)}
              name="description"
              id="eventDescription"
              value={props.shipmentEvent.description}
              onChange={(e) => props.handleShipmentEventChange(e)}
              className={cn(
                "w-full p-2 outline-none border border-orange-200/80 min-h-[6rem] max-w-full bg-white text-black focus:ring-2 focus-visible:ring-2 focus:ring-orange-400/75 ",
                isEventErrors(eventErrors) &&
                  eventErrors.description.showErrorMessage &&
                  "outline-2 outline-red-400"
              )}
              required
              aria-required
              autoFocus={false}
            ></textarea>
          </p>
        </div>
        <DialogFooter>
          <Button
            disabled={!canEventBeSubmitted}
            size={"sm"}
            onClick={props.handleEventSubmission}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
