import { useEffect, useRef, useState } from "react";
// import Marquee from "react-fast-marquee";
import { useAccount } from "wagmi";
import {
  useAnimationConfig,
  useScaffoldContract,
  useScaffoldContractRead,
  useScaffoldEventHistory,
  useScaffoldEventSubscriber,
} from "~~/hooks/scaffold-eth";

const MARQUEE_PERIOD_IN_SEC = 5;

export const ContractData = () => {
  const { address } = useAccount();
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isRightDirection, setIsRightDirection] = useState(false);
  const [marqueeSpeed, setMarqueeSpeed] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLDivElement>(null);

  const { data: latestResponse, isLoading: isGreetingLoading, refetch: refetchLatestResponse  } = useScaffoldContractRead({
    contractName: "FunctionsConsumer",
    functionName: "latestResponse",
  });

  let topicsLength, topicsBuffer_new, dataBuffer_new, decodedTopics, output, slot,storageData;
  if (latestResponse) {
    const hexString = latestResponse; // Assuming latestResponse is a string containing a hexadecimal representation
    const hexWithoutPrefix = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
    if(hexWithoutPrefix.substr(0, 2) != "00"){
    const byteLength = hexWithoutPrefix.length / 2;
    const buffer = new Uint8Array(byteLength);
    
    for (let i = 0; i < byteLength; i++) {
      const byteHex = hexWithoutPrefix.substr(i * 2, 2);
      const byte = parseInt(byteHex, 16);
      buffer[i] = byte;
    }
    const view = new DataView(buffer.buffer);

  if (view.byteLength > 0) {
  
    const view = new DataView(buffer.buffer);
  
    topicsLength = view.getUint8(0);
    // console.log(topicsLength);
  
    topicsBuffer_new = buffer.subarray(1, 1 + topicsLength * 32);
    // console.log(topicsBuffer_new);
  
    dataBuffer_new = buffer.subarray(1 + topicsLength * 32);
  
    decodedTopics = [];
    for (let i = 0; i < topicsLength; i++) {
      const topicBuffer = topicsBuffer_new.subarray(i * 32, (i + 1) * 32);
      const topicHex = "0x" + Array.from(topicBuffer).map(byte => byte.toString(16).padStart(2, '0')).join('');
      decodedTopics.push(topicHex);
    }
    // console.log('Decoded Topics:', decodedTopics);
    // console.log('Decoded Data:', Array.from(dataBuffer_new).map(byte => byte.toString(16).padStart(2, '0')).join(''));
    output = Array.from(dataBuffer_new).map(byte => byte.toString(16).padStart(2, '0')).join('');
  }
} else {
  let localdata=hexWithoutPrefix.slice(2);

  let slotfinder = localdata.substr(localdata.length - 64);

  storageData='0x'+localdata.substr(localdata.length - 64);

  
  slot='0x'+localdata.substr(0,(localdata.length - slotfinder.length));
  }
}
  
  // const { data: currentGreeting, isLoading: isGreetingLoading } = useScaffoldContractRead({
  //   contractName: "YourContract",
  //   functionName: "greeting",
  // });

  const handleRequestSent = async (requestId: string) => {
    console.log(requestId);

    // Fetch the latestResponse again
    await refetchLatestResponse();

    if (latestResponse) {
      console.log(latestResponse);
      // ... Decoding logic
    }
  }

  useScaffoldEventSubscriber({
    contractName: "FunctionsConsumer",
    eventName: "RequestSent",
    listener: handleRequestSent,
  });

  // const {
  //   data: myGreetingChangeEvents,
  //   isLoading: isLoadingEvents,
  //   error: errorReadingEvents,
  // } = useScaffoldEventHistory({
  //   contractName: "YourContract",
  //   eventName: "GreetingChange",
  //   fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
  //   filters: { greetingSetter: address },
  //   blockData: true,
  // });

  // console.log("Events:", isLoadingEvents, errorReadingEvents, myGreetingChangeEvents);

  // const { data: yourContract } = useScaffoldContract({ contractName: "FunctionsConsumer" });
  // console.log("yourContract: ", yourContract);

  // const { showAnimation } = useAnimationConfig(totalCounter);

  // const showTransition = transitionEnabled && !!currentGreeting && !isGreetingLoading;

  useEffect(() => {
    if (transitionEnabled && containerRef.current && greetingRef.current) {
      setMarqueeSpeed(
        Math.max(greetingRef.current.clientWidth, containerRef.current.clientWidth) / MARQUEE_PERIOD_IN_SEC,
      );
    }
  }, [transitionEnabled, containerRef, greetingRef]);

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-b from-gray-800 to-black bg-no-repeat bg-cover py-10 px-5 sm:px-0 lg:py-auto max-w-[100vw]">
 <div className="flex flex-col w-90 h-1/2 bg-base-200 bg-opacity-70 rounded-2xl shadow-lg px-5 py-4">
  <div className="px-4">
    <span className="text-3xl sm:text-1m text-black">Latest Onchain Response</span>
  </div>
  <div><span>&nbsp;</span></div>
  <div className="relative overflow-x-auto overflow-y-hidden" ref={containerRef}>
  {/* for speed calculating purposes */}
  <div className="px-4 py-2 bg-gray-800 text-white">
    <div className="inline-block min-w-full">
      <div className="w-96 h-60 overflow-x-auto whitespace-pre">
        {
          decodedTopics && decodedTopics.length > 0  ? (
          <>
      <div>
      <span>Decoded Topics: {decodedTopics ? `[ ${decodedTopics.join(', ')} ]` : 'N/A'}</span>
            </div>
            <div>
              <span>Decoded Data: {output}</span>
            </div>
            </>
        ) : (

          slot && storageData && slot.slice(2).length >0 ? (
            <>
            <div>
        <span>Decoded Slot: {slot}</span>
              </div>
              <div>
                <span>Decoded Storage Data: {storageData}</span>
              </div>
             </>
          ) : ("No Data")
         
          ) }
        {/* {latestResponse || " "} */}
      </div>
    </div>
  </div>
</div>
</div>
    </div>
  );
  
};
