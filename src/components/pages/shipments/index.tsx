import { useEffect, useState } from "react";

import { TShipments, useAxiosPrivate } from "../../../../sdk";
import { ShipmentUI } from "./_components/shipment-ui";
import { Loader } from "lucide-react";

const ShipmentPage = () => {
  const axios = useAxiosPrivate();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [shipments, setShipments] = useState<TShipments | []>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchShipments = async () => {
      setLoading(true);
      try {
        const { data } = await axios(`/shipment`, {
          withCredentials: true,
          signal: controller.signal,
        });

        isMounted && setShipments(data?.data?.allShipment);
      } catch (error: any) {
        // console.log(error?.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axios]);

  if (loading) {
    return (
      <div className="loader w-full flex flex-col justify-center items-center bg-neutral-100">
        <Loader className="animate-spin w-8 h-8 text-orange-600" />
        <span className="text-sm">Please wait...</span>
      </div>
    );
  }

  if (!isMounted) {
    return null;
  }

  return (
    <div className=" min-h-screen py-12 px-4 sm:px-8 w-full">
      <div className="md:max-w-screen-lg mx-auto">
        <ShipmentUI shipments={shipments} setShipments={setShipments} />
      </div>
    </div>
  );
};

export default ShipmentPage;
