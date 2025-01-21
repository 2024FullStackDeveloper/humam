"use client";
"use client";
export interface SingleRowProps{
icon:React.ReactNode,
label:string,
value?:string | React.ReactNode,
title?:string | null
};
const SingleRow = ({
icon,
label,
value,
title
}:SingleRowProps) => {
  return (
    <div className=" justify-between items-center flex flex-row gap-1">
      <div className="gap-2 flex flex-row justify-center items-center">
          {icon}
        <span  className="text-sm text-secondary">
            {label}
        </span>
      </div>
      <div className="text-sm text-primary  font-semibold truncate max-w" title={title ?? ''}>
        {value}
      </div>
    </div>
  );
};
export default SingleRow;
