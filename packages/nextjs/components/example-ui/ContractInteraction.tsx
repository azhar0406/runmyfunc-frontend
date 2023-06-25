import { useState,useEffect } from "react";
import { CopyIcon } from "./assets/CopyIcon";
import { DiamondIcon } from "./assets/DiamondIcon";
import { HareIcon } from "./assets/HareIcon";
import { ArrowSmallRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractWrite,useDeployedContractInfo, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { BigNumber, utils } from "ethers";

export const ContractInteraction = () => {
  const [visible, setVisible] = useState(false);
  const [newContract, setNewContract] = useState("");
  const [newSource, setNewSource] = useState("");
  const [newSecret, setNewSecret] = useState("");
  const [newArgs, setNewArgs] = useState<string[]>([]);
  const [newSubID, setNewSubID] = useState("");
  const [newGaslimit, setNewGaslimit] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputString = e.target.value;
    const argsArray = inputString.split(/,(?![^(]*\))/).map((arg) => arg.trim());
    setNewArgs(argsArray);
  
  // if (argsArray) {
  //   setNewArgs(argsArray);
  // } else {
  //   setNewArgs([]); // Set an empty array as the default value
  // }
  
  };

  const handleClickChange = () => {
    setNewArgs(deployedContractData ? [...deployedContractData.args] : []);

  };


    const handleClickChange2 = () => {
      setNewArgs(deployedContractData ? [...deployedContractData.args2] : []);
    };

const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "FunctionsConsumer",
    functionName: "executeRequest",
    overrides: {gasLimit : BigNumber.from("450000")},
    cAddress: newContract,
    args: [newSource,`0x${newSecret}`,newArgs,BigNumber.from(newSubID? newSubID:0),Number(newGaslimit)],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });
  // console.log(newArgs);
  // const handleSecretChange = (event) => {
  //   let value = event.target.value;
    
  //   if (!value.startsWith('0x')) {
  //     value = '0x' + value;
  //   }
    
  //   setNewSecret(value);
  // };

  type TupleType = {
    codeLocation: number;
    secretsLocation: number;
    language: number;
    source: string;
    secrets: `0x${string}`;
    args: readonly string[];
  };
  
  const tuple: TupleType = {
    codeLocation: 0,
    secretsLocation: 1,
    language: 0,
    source: ""+newSource+"",
    secrets: newSecret.startsWith('0x') ? `0x${newSecret.replace(/^0x/, "")}` : `0x${newSecret}`,
    args: [],
  };
  const { data: deployedContractData } = useDeployedContractInfo("FunctionsConsumer");

  useEffect(() => {
    if (deployedContractData) {
      setNewContract(deployedContractData.address || '');
      setNewSource(deployedContractData.source || '');
      setNewSecret(deployedContractData.secret || '');
      setNewArgs(deployedContractData.args ? [...deployedContractData.args] : []);
      setNewSubID(deployedContractData.subscriptionId || '');
      setNewGaslimit(deployedContractData.gasLimit || '');
    }
  }, [deployedContractData]);



    const { data: estiamtedLink, isLoading: isEstimatedLoading } = useScaffoldContractRead({
    contractName: "FunctionsConsumer",
    functionName: "estimateCost",
    cAddress: newContract,
    args: [tuple,BigNumber.from(newSubID? newSubID : 0),Number(newSubID? newSubID:0),BigNumber.from(2352250021)],
  });

  
  return (
    
    <div className="flex bg-base-300 relative pb-10">
      <DiamondIcon className="absolute top-24" />
      <CopyIcon className="absolute bottom-0 left-36" />
      <HareIcon className="absolute right-0 bottom-24" />
      <div className="flex flex-col w-full mx-5 sm:mx-8 2xl:mx-20">
        <div className={`hidden mt-10 flex gap-2 ${visible ? "" : "invisible"} max-w-2xl`}>
          <div className="flex gap-5 bg-base-200 bg-opacity-80 z-0 p-7 rounded-2xl shadow-lg">
            <span className="text-3xl">👋🏻</span>
            <div>
              <div>
                In this page you can see how some of our <strong>hooks & components</strong> work, and how you can bring
                them to life with your own design! Have fun and try it out!
              </div>
              <div className="mt-2">
                Check out{" "}
                <code className="italic bg-base-300 text-base font-bold [word-spacing:-0.5rem]">
                  packages / nextjs/pages / example-ui.tsx
                </code>{" "}
                and its underlying components.
              </div>
            </div>
          </div>
          <button
            className="btn btn-circle btn-ghost h-6 w-6 bg-base-200 bg-opacity-80 z-0 min-h-0 drop-shadow-md"
            onClick={() => setVisible(false)}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
  {/* setNewContract(deployedContractData? deployedContractData?.address :"");
  setNewSource(deployedContractData? deployedContractData?.source : "");
  setNewSecret(deployedContractData? deployedContractData?.secret : "");
  setNewArgs(deployedContractData? deployedContractData?.args : "");
  setNewSubID(deployedContractData? deployedContractData?.subscriptionId : "");
  setNewGaslimit(deployedContractData? deployedContractData?.gasLimit : ""); */}

        <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
          <span className="text-2xl sm:text-3xl text-black">Execute Request</span>
         <span className="text-1xl sm:text-1m text-grey">Get Event Logs / Contract Sotrage Slot Onchain</span>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">

                      <div className="mt-1 w-full">
                      <div className="flex flex-col">
                        <label className="text-1xl sm:text-1m text-black">FunctionsConsumer Contract:</label>
                <input onChange={e => setNewContract(e.target.value)} value={newContract} type="text" placeholder="FunctionsConsumer Contract Address" className="input font-bai-jamjuree w-full px-5 border border-primary text-md sm:text-1xl placeholder-black" />
              </div>
              <div className="flex flex-col mt-5">
              <label className="text-1xl sm:text-1m text-black">Source:</label>
                <textarea onChange={e => setNewSource(e.target.value)} defaultValue={newSource}   className="input font-bai-jamjuree w-full px-5 border border-primary text-md ssm:text-1xl placeholder-white"></textarea>
              </div>
              <div className="flex flex-col mt-5">
              <label className="text-1xl sm:text-1m text-black">Secret:</label>
                <input onChange={e => setNewSecret(e.target.value)} value={newSecret}  type="text" placeholder="Secret" className="input font-bai-jamjuree w-full px-5 border border-primary text-md sm:text-1xl placeholder-black " />
              </div>
	      <div className="flex flex-col mt-5">
              <label className="text-1xl sm:text-1m text-black">Args[]:</label>
                <div className="flex items-center space-x-2">
                  <input onChange={handleInputChange} value={newArgs} type="text" placeholder="Args[]" className="input font-bai-jamjuree w-full px-5 border border-primary text-md sm:text-1xl placeholder-black" />
                </div>
                <div className="flex items-center space-x-2 mt-2">
		<button onClick={handleClickChange} className="text-blue-500 hover:underline bg-transparent border-none cursor-pointer">Get Sample Log</button>
		<p> | </p>
                <button onClick={handleClickChange2} className="text-blue-500 hover:underline bg-transparent border-none cursor-pointer">Get Sample Storage</button>                </div>
              </div>              <div className="flex flex-col mt-5">
              <label className="text-1xl sm:text-1m text-black">Subscription ID:</label>
                <input onChange={e => setNewSubID(e.target.value)} value={newSubID} type="text" placeholder="Subscription ID" className="input font-bai-jamjuree w-full px-5 border border-primary text-md sm:text-1xl placeholder-black " />
              </div>
              <div className="flex flex-col mt-5">
              <label className="text-1xl sm:text-1m text-black">GAS Limit:</label>
                <input onChange={e => setNewGaslimit(e.target.value)} value={newGaslimit} type="text" placeholder="GAS Limit" className="input font-bai-jamjuree w-full px-5 border border-primary text-md sm:text-1xl placeholder-black" />
              </div>
              <div className="mt-5 flex flex-row items-center gap-2 sm:gap-5">
              <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
              <div className="flex rounded-full border-2 border-primary p-1">
                <button
                  className={`btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${
                    isLoading ? "loading" : ""
                  }`}
                  onClick={writeAsync}
                >
                  {!isLoading && (
                    <>
                      Send <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
              </div>
            </div>
            </div>

    
            
         

          <div className="mt-4 flex gap-2 items-start">
            <span className="text-sm leading-tight">Price:</span>
            <div className="badge badge-warning">{ estiamtedLink ? utils.formatEther(estiamtedLink) :"Estimating..."} Link + Gas</div>
          </div>
        </div>
      </div>
    </div>
  );
};
