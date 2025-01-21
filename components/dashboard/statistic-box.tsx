import React from 'react';

interface StatisticBoxProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    value: number;
}

const StatisticBox: React.FC<StatisticBoxProps> = ({ icon, title, subtitle , value }) => {
    return (
        <article className="h-24 rounded-lg border border-secondary/20 bg-destructive flex flex-row items-center  p-2 gap-2 shadow">
          <div className="flex flex-row items-center justify-center rounded-full h-14 w-14 bg-white shadow">
          {icon}
          </div>
          <div className="grow flex flex-row justify-between items-center">
            <div className="flex flex-col gap-1 text-sm xl:text-lg">
              <h3 className="font-bold">{title}</h3>
              <p>{subtitle}</p>
            </div>
            <div className="bg-white h-10  rounded-lg flex justify-center items-center min-w-12 font-bold">
                {value}
            </div>
          </div>
        </article>
    );
};

export default StatisticBox;