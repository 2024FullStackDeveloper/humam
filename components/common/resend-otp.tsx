"use client";
import useLocalizer from "@/lib/hooks/use-localizer";
import React from "react";
import { clearInterval, setInterval } from "timers";
import TextButton from "./text-button";
export interface ResendOtpProps {
  durationBySeconds?: number;
  onClick?: () => void;
}
const ResendOtp = ({ durationBySeconds = 30, onClick }: ResendOtpProps) => {

  const { t } = useLocalizer();
  const [count, setCount] = React.useState(0);
  const [isActive, setIsActive] = React.useState(false);
  
  React.useEffect(() => {
    let intervalId : any;
    let counter = durationBySeconds;
    if (isActive) {
      intervalId = setInterval(() => {
        setCount(counter);
        counter--;
        if(counter == 0){
          setIsActive(false);
          setCount(durationBySeconds);
          clearInterval(intervalId);
          return;
        }
      }, 1000);
    }
    return () => {
      if(intervalId){
        clearInterval(intervalId);
      }
    }
  }, [isActive]);


  const handleToggle = () => {
    setIsActive(!isActive);
    if(onClick){
      onClick();
    }
  };
  const countDownRender = React.useCallback((): React.JSX.Element => {
    const format =
      count?.toString()?.length == 1
        ? "0".concat(count.toString())
        : count?.toString();
    return (
      <span className="font-semibold select-none text-secondary text-sm md:text-[16px]">{`(00:${format})`}</span>
    );
  }, [count]);

  return (
    <>
      {!isActive  ? (
        <TextButton
          onClick={()=>handleToggle()}
          className="text-sm md:text-[16px]"
        >
          {t("buttons.resend")}
        </TextButton>
      ) : (
        countDownRender()
      )}
    </>
  );
};
export default ResendOtp;
