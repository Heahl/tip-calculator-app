import Head from "next/head";
import Image from "next/image";
import { set, z } from "zod";
import { useState, useEffect } from "react";

const billSchema = z.number().min(0.01).max(999.99);
const tipSchema = z.number().min(1).max(100);
const numberOfPeopleSchema = z.number().min(1).max(99).int();

export default function Home() {
  const [billActive, setBillActive] = useState(false);
  const [tipActive, setTipActive] = useState(false);
  const [numOfPeopleActive, setNumOfPeopleActive] = useState(false);
  const [activeTipButton, setActiveTipButton] = useState<number | null>(null);
  const [billAmount, setBillAmount] = useState("");
  const [tipAmount, setTipAmount] = useState("");
  const [customTip, setCustomTip] = useState("");
  const [numOfPeople, setNumOfPeople] = useState("");
  const [tipAmountPerPerson, setTipAmountPerPerson] = useState("0.00");
  const [totalPerPerson, setTotalPerPerson] = useState("0.00");

  const handleBillChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let input = event.target.value;
    input = input.replace(/[^0-9.]/g, "");
    const inputNumber = parseInt(input.replace(".", ""));
    if (input === "") {
      setBillAmount("");
    } else {
      if (inputNumber < 1) {
        input = "1";
      } else if (inputNumber > 999999) {
        input = "999999";
      }
      setBillAmount((inputNumber / 100).toFixed(2));
    }
  };

  const handleTipButtonClick = (percentage: number) => {
    setActiveTipButton(percentage);
    setTipAmount(percentage.toString());
    setCustomTip("");
  };

  const handleCustomTipChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let input = event.target.value;
    input = input.replace(/[^0-9]/g, "");
    const numericInput = parseInt(input, 10);
    if (numericInput < 1) {
      input = "1";
    } else if (numericInput > 100) {
      input = "100";
    }
    setActiveTipButton(null);
    setTipAmount(input);
    setCustomTip(input);
  };

  const handleNumOfPeopleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let input = event.target.value;
    input = input.replace(/[^0-9]/g, "");
    if (input === "") {
      setNumOfPeople("");
    } else {
      let inputNumber = parseInt(input);
      if (inputNumber < 1) {
        inputNumber = 1;
      } else if (inputNumber > 100) {
        inputNumber = 100;
      }
      setNumOfPeople(inputNumber.toString());
    }
  };

  const calculateTipPerPerson = () => {
    const bill = parseFloat(billAmount);
    const totalTip = (bill * parseFloat(tipAmount)) / 100;
    return (totalTip / parseFloat(numOfPeople)).toFixed(2);
  };

  const calculateTotalPerPerson = () => {
    const bill = parseFloat(billAmount);
    const totalAmount = bill + (bill * parseFloat(tipAmount)) / 100;
    return (totalAmount / parseFloat(numOfPeople)).toFixed(2);
  };

  useEffect(() => {
    if (billAmount !== "" && tipAmount !== "" && numOfPeople !== "") {
      const tipPerPerson = calculateTipPerPerson();
      setTipAmountPerPerson(tipPerPerson);
    }
  }, [billAmount, tipAmount, numOfPeople]);

  useEffect(() => {
    if (billAmount !== "" && tipAmount !== "" && numOfPeople !== "") {
      const totalPerPerson = calculateTotalPerPerson();
      setTotalPerPerson(totalPerPerson);
    }
  }, [billAmount, tipAmount, numOfPeople]);

  // Styles
  const billStyle = billActive
    ? `bg-white border-strong-cyan border-2 outline-none`
    : `bg-light-grayish-cyan/50`;
  const tipStyle = tipActive
    ? `bg-white border-2 border-strong-cyan outline-none`
    : `bg-light-grayish-cyan/50`;
  const numOfPeopleStyle = numOfPeopleActive
    ? `bg-white border-2 border-strong-cyan outline-none`
    : `bg-light-grayish-cyan/50`;
  const buttonStyle = (percentage: number) => {
    if (activeTipButton === percentage) {
      return `h-12 bg-strong-cyan rounded-lg text-very-dark-cyan w-auto font-sMonoRegular text-2xl`;
    } else {
      return `h-12 bg-very-dark-cyan rounded-lg hover:bg-very-dark-cyan/90 text-very-light-grayish-cyan w-auto font-sMonoRegular font-medium text-2xl`;
    }
  };

  function resetInputs() {
    setBillAmount("");
    setTipAmount("");
    setNumOfPeople("");
  }

  return (
    <>
      <Head>
        <title>Tip Calculator</title>
        <meta name="description" content="tip-calculator-app" />
        <link rel="icon" href="/images/favicon-32x32.png" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-end bg-light-grayish-cyan font-sMonoRegular md:justify-center">
        {/* Container */}
        <div className="relative flex h-full flex-col">
          {/* Logo */}
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={200}
            height={200}
            className="absolute left-1/2 top-0 h-auto w-28 -translate-x-1/2 translate-y-[-180%]"
          />
          {/* Calculator */}
          <div className="flex h-full w-[80vw] max-w-[500px] flex-col gap-8 rounded-t-2xl bg-very-light-grayish-cyan p-8 shadow-lg md:min-w-[800px] md:max-w-[1150px] md:flex-row md:items-stretch md:rounded-2xl">
            {/* Input Side */}
            <div className="flex h-1/2 w-full flex-col gap-8 md:h-full md:w-1/2">
              {/* Bill */}
              <div className="h-1/4 w-full">
                <label htmlFor="bill" className="text-dark-grayish-cyan">
                  Bill
                </label>
                <div
                  className={`mt-2 flex h-12 w-full items-center rounded-lg ${billStyle}`}
                >
                  <Image
                    src={"/images/icon-dollar.svg"}
                    width={24}
                    height={24}
                    alt="Dollar Icon"
                    className="ml-4 h-5 w-auto"
                  />
                  <input
                    className={`h-full w-full bg-transparent pr-3 text-right font-sMonoBold text-3xl text-very-dark-cyan outline-none`}
                    onClick={() => setBillActive(true)}
                    onBlur={() => setBillActive(false)}
                    onChange={handleBillChange}
                    value={billAmount}
                    type="text"
                    id="bill"
                    placeholder="0.00"
                  />
                </div>
              </div>
              {/* Tip Selector */}
              <div className="h-2/4 w-full">
                <label htmlFor="tip" className="text-dark-grayish-cyan">
                  Select Tip %
                </label>
                <div className="mt-2 grid w-full grid-cols-2 grid-rows-3 gap-2 md:grid-cols-3 md:grid-rows-2">
                  <button
                    className={buttonStyle(5)}
                    onClick={() => handleTipButtonClick(5)}
                  >
                    5%
                  </button>
                  <button
                    className={buttonStyle(10)}
                    onClick={() => handleTipButtonClick(10)}
                  >
                    10%
                  </button>
                  <button
                    className={buttonStyle(15)}
                    onClick={() => handleTipButtonClick(15)}
                  >
                    15%
                  </button>
                  <button
                    className={buttonStyle(25)}
                    onClick={() => handleTipButtonClick(25)}
                  >
                    25%
                  </button>
                  <button
                    className={buttonStyle(50)}
                    onClick={() => handleTipButtonClick(50)}
                  >
                    50%
                  </button>
                  <input
                    className={`${tipStyle} h-12 w-full rounded-lg px-3 text-right font-sMonoBold text-2xl text-very-dark-cyan outline-none placeholder:text-dark-grayish-cyan`}
                    type="text"
                    id="tip"
                    onClick={() => setTipActive(true)}
                    onBlur={() => {
                      if (customTip === "") {
                        setTipActive(false);
                      }
                    }}
                    onChange={handleCustomTipChange}
                    value={tipActive ? customTip : ""}
                    placeholder="Custom..."
                  />
                </div>
              </div>
              {/* Num of People */}
              <div className="h-1/4 w-full">
                <label htmlFor="numOfPeople" className="text-dark-grayish-cyan">
                  Number of People
                </label>
                <div
                  className={`mt-2 flex h-12 w-full items-center rounded-lg ${numOfPeopleStyle}`}
                >
                  <Image
                    src={"/images/icon-person.svg"}
                    width={24}
                    height={24}
                    alt="Person Icon"
                    className="ml-4 h-5 w-auto"
                  />
                  <input
                    className={`h-full w-full appearance-none bg-transparent pr-3 text-right font-sMonoBold text-3xl text-very-dark-cyan outline-none`}
                    type="text"
                    id="numOfPeople"
                    onClick={() => setNumOfPeopleActive(true)}
                    onBlur={() => setNumOfPeopleActive(false)}
                    onChange={handleNumOfPeopleChange}
                    value={numOfPeople}
                    min={"1"}
                    max={"99"}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            {/* Output Side */}
            <div className="flex w-full flex-grow flex-col items-center justify-between gap-8 rounded-xl bg-very-dark-cyan px-6 py-8 md:w-1/2 md:px-8 md:py-10">
              {/* Tip + Total */}
              <div className="flex w-full flex-col gap-4 md:gap-8">
                {/* Tip Amount */}
                <div className="flex w-full items-center justify-between">
                  <div className="flex h-full flex-col items-start">
                    <p className="text-lg text-very-light-grayish-cyan">
                      Tip Amount
                    </p>
                    <p className="text-grayish-cyan">/ person</p>
                  </div>
                  <div className="flex h-full items-center font-sMonoBold text-5xl text-strong-cyan">
                    <p>
                      <span className="font-sMonoRegular">$</span>
                      {tipAmountPerPerson}
                    </p>
                  </div>
                </div>
                {/* Total */}
                <div className="flex w-full items-center justify-between">
                  <div className="flex h-full flex-col items-start">
                    <p className="text-lg text-very-light-grayish-cyan">
                      Total
                    </p>
                    <p className="text-grayish-cyan">/ person</p>
                  </div>
                  <div className="flex h-full items-center font-sMonoBold text-5xl text-strong-cyan">
                    <p>
                      <span className="font-sMonoRegular">$</span>
                      {totalPerPerson}
                    </p>
                  </div>
                </div>
              </div>
              {/* Reset Button */}
              <div className="relative mt-4 h-12 w-full overflow-hidden rounded-lg">
                <button
                  className="relative z-20 h-full w-full rounded-lg bg-strong-cyan text-xl capitalize tracking-wider hover:bg-strong-cyan/80"
                  onClick={resetInputs}
                >
                  RESET
                </button>
                <div className="absolute left-0 top-0 z-10 h-full w-full bg-light-grayish-cyan" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
