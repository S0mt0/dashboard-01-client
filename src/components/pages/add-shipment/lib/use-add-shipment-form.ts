import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  ShipmentErrors,
  TEvent,
  TShipment,
  generateRandomNumbers,
  shipmentEventInitState,
  shipmentInitState,
  useAxiosPrivate,
  useShipmentInputsValidation,
} from "../../../../../sdk";
import { toast } from "sonner";

export const useAddShipmentForm = () => {
  const [shipment, setShipment] = useState<TShipment>(shipmentInitState);
  const axios = useAxiosPrivate();

  // When component mounts, generate a new random trackingId number and assign to shipment trackingId prop
  useEffect(() => {
    let isMounted = true;
    const { code } = generateRandomNumbers(10);

    isMounted &&
      setShipment((prevShipment) => ({
        ...prevShipment,
        trackingId: code,
      }));

    return () => {
      isMounted = false;
    };
  }, []);

  // function to refresh or generate new tracking numbers if needed
  const refreshNumber = () => {
    const { code } = generateRandomNumbers(10);

    setShipment((prevShipment) => ({
      ...prevShipment,
      trackingId: code,
    }));
  };

  // handle subsequent form change events
  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    e.persist();
    const { name, value } = e.target;

    switch (name) {
      case "fullName":
      case "email":
      case "country":
        return setShipment((prevShipment) => ({
          ...prevShipment,
          belongsTo: { ...prevShipment.belongsTo, [name]: value },
        }));

      case "originAddress":
        return setShipment((prevShipment) => ({
          ...prevShipment,
          origin: {
            ...prevShipment.origin,
            address: {
              ...prevShipment.origin.address,
              addressLocality: value,
            },
          },
        }));

      case "destinationAddress":
        return setShipment((prevShipment) => ({
          ...prevShipment,
          destination: {
            ...prevShipment.destination,
            address: {
              ...prevShipment.destination.address,
              addressLocality: value,
            },
          },
        }));

      case "statusTimestamp":
        return setShipment((prevShipment) => ({
          ...prevShipment,
          status: { ...prevShipment.status, timestamp: value },
        }));

      case "statusLocationAddress":
        return setShipment((prevShipment) => ({
          ...prevShipment,
          status: {
            ...prevShipment.status,
            location: {
              ...prevShipment.status.location,
              address: {
                ...prevShipment.status.location.address,
                addressLocality: value,
              },
            },
          },
        }));

      case "status":
        return setShipment((prevShipment) => ({
          ...prevShipment,
          status: {
            ...prevShipment.status,
            status: value as "pending" | "shipping" | "delivered" | "seized",
          },
        }));

      case "statusDescription":
        return setShipment((prevShipment) => ({
          ...prevShipment,
          status: { ...prevShipment.status, description: value },
        }));

      case "bill":
        return setShipment((prevShipment) => ({
          ...prevShipment,
          status: { ...prevShipment.status, bill: +value },
        }));

      default:
        return setShipment((prevShipment) => ({
          ...prevShipment,
          [name]: value,
        }));
    }
  };

  // form for shipment event section
  const [shipmentEvent, setShipmentEvent] = useState<TEvent>(
    shipmentEventInitState
  );

  const handleShipmentEventChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.persist();
    const { name, value } = e.target;

    switch (name) {
      case "eventLocationAddress":
        return setShipmentEvent((prevEvent) => ({
          ...prevEvent,
          location: {
            ...prevEvent.location,
            address: {
              ...prevEvent.location.address,
              addressLocality: value,
            },
          },
        }));

      default:
        return setShipmentEvent((prevEvent) => ({
          ...prevEvent,
          [name]: value,
        }));
    }
  };

  // state to determine what action the button on the modal should take, whether to edit an event or to add a new one
  const [whatToDo, setWhatToDo] = useState<"add" | "edit">("add");

  // modal state

  const resetEventModal = useCallback(() => {
    // clear modal content before closing so that when modal opens again, it doesn't open prefilled with an event data
    setShipmentEvent(shipmentEventInitState);
  }, []);

  const toggleMode = useCallback(
    (type: "add" | "edit", eventId?: string) => {
      const allEvents = shipment.events;

      if (type === "add") {
        setWhatToDo("add");
      } else if (type === "edit") {
        setWhatToDo("edit");
        /** load modal with the data for the event that is to be edited */
        const foundEvent = allEvents.find((event) => event.eventId === eventId);

        foundEvent && setShipmentEvent(foundEvent);
      }
    },
    [shipment.events]
  );

  // handle what happens when an event is submitted. Should it be edited or should it be added as new?
  const handleEventSubmission = useCallback(() => {
    if (whatToDo === "add") {
      setShipment((prevShipment) => ({
        ...prevShipment,
        events: [...prevShipment.events, shipmentEvent],
      }));

      resetEventModal();
      toast.success("Event added successfully");
    } else {
      const filteredEvents = shipment.events.filter(
        (event) => event.eventId !== shipmentEvent.eventId
      );

      setShipment((prevShipment) => ({
        ...prevShipment,
        events: [...filteredEvents, { ...shipmentEvent }],
      }));

      resetEventModal();
      toast.success("Event modified successfully");
    }
  }, [resetEventModal, shipment.events, whatToDo, shipmentEvent]);

  // delete single event
  const deleteEvent = useCallback(
    (eventId: string) => {
      const allEvents = shipment.events;

      // filter out unwanted event
      const filteredEvents = allEvents.filter((event) => {
        return event.eventId !== eventId;
      });

      setShipment((prevShipment) => ({
        ...prevShipment,
        events: [...filteredEvents],
      }));
    },
    [shipment.events]
  );

  // check for shipment form validity
  const { shipmentErrors } = useShipmentInputsValidation();

  const canShipmentBeSubmitted = useCallback(() => {
    return (
      Object.values(shipmentErrors as ShipmentErrors).every(
        (error) => error.message === ""
      ) &&
      Boolean(shipment.events.length) &&
      Boolean(shipment.trackingId)
    );
  }, [shipment.events.length, shipment.trackingId, shipmentErrors]);

  // form submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  // handle form submission
  const handleShipmentSubmission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const { data } = await axios.post("/shipment", shipment, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      toast.success(data?.message);
      setShipment(shipmentInitState);
      navigate("/dashboard/shipment");
    } catch (error: any) {
      toast.error(error?.response?.data?.data?.validation_error_message);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    states: {
      shipment,
      shipmentEvent,
      isSubmitting,
      whatToDo,
    },

    actions: {
      handleFormChange,
      handleShipmentEventChange,
      resetEventModal,
      toggleMode,
      handleEventSubmission,
      handleShipmentSubmission,
      refreshNumber,
      deleteEvent,
      setShipmentEvent,
      canShipmentBeSubmitted,
    },
  };
};
