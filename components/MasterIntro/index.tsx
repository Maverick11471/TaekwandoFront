import React from "react";
import { Timeline } from "./timeline";

export default function TimelineDemo() {
  const data = [
    {
      title: "2022",
      content: (
        <div>
          <p className="text-white dark:text-neutral-200 text-lg md:text-xl font-normal mb-8">
            경희대 최강 태권도 개장
          </p>
        </div>
      ),
    },
    {
      title: "2014",
      content: (
        <div>
          <p className="text-white dark:text-neutral-200 text-lg md:text-xl font-normal mb-8">
            경희대학교 태권도학과 졸업
          </p>
        </div>
      ),
    },

    {
      title: "2009",
      content: (
        <div>
          <p className="text-white dark:text-neutral-200 text-lg md:text-xl font-normal mb-8">
            용인대총장기 전국 품새대회 단체전 금메달
          </p>
        </div>
      ),
    },
    {
      title: "2007",
      content: (
        <div>
          <p className="text-white dark:text-neutral-200 text-lg md:text-xl font-normal mb-8">
            태권도한마당 전국 품새대회 개인전 동메달
          </p>
        </div>
      ),
    },
    {
      title: "2006",
      content: (
        <div>
          <p className="text-white dark:text-neutral-200 text-lg md:text-xl font-normal mb-8">
            용인대총장기 전국 품새대회 단체전 동메달
          </p>
        </div>
      ),
    },
    {
      title: "2005",
      content: (
        <div>
          <p className="text-white dark:text-neutral-200 text-lg md:text-xl font-normal mb-8">
            경희대총장기 전국 품새대회 단체전 동메달
          </p>
        </div>
      ),
    },
    {
      title: "2004",
      content: (
        <div>
          <p className="text-white dark:text-neutral-200 text-lg md:text-xl font-normal mb-8">
            우석대총장기 전국 품새대회 단체전 금메달
          </p>
        </div>
      ),
    },
    {
      title: "2003",
      content: (
        <div>
          <p className="text-white dark:text-neutral-200 text-lg md:text-xl font-normal mb-8">
            우석대총장기 전국 품새대회 단체전 금메달, 개인전 은메달
          </p>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}
