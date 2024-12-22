import { Config } from "src/utils/config";
import { assistantContainerEl } from "src/newtab/scripts/ui";

export type AssistItem =
  | AssistHistoryList
  | AssistDate
  | AssistMath
  | AssistDefinition
  | AssistConversion;

interface AssistHistoryList {
  type: "history";
  historyItems: chrome.history.HistoryItem[];
}

interface AssistDate {
  type: "date";
}

interface AssistMath {
  type: "math";
  result: string;
}

interface AssistDefinition {
  type: "definition";
  result: any;
}

interface AssistConversion {
  type: "conversion";
  before: string;
  after: string;
}

export const hideAssist = () => {
  assistantContainerEl.innerHTML = "";
  assistantContainerEl.classList.replace("grid", "hidden");
};

export const displayAssist = (items: AssistItem[], config: Config) => {
  assistantContainerEl.innerHTML = "";
  assistantContainerEl.classList.replace("hidden", "grid");

  items.forEach((item, index) => {
    // if (item.type === "history") {
    //   item.historyItems.forEach((hi) => {
    //     assistantContainerEl.innerHTML += `
    //     <div class="grid grid-cols-[max-content_auto]">
    //       <span class="font-semibold" style="color: ${config.search.placeholderTextColor}">&nbsp;~&nbsp;</span>
    //       <div class="text-ellipsis overflow-hidden whitespace-nowrap w-full" style="color: ${config.search.placeholderTextColor}">${hi.title}</div>
    //     </div>`;
    //   });
    // }
    if (item.type === "date") {
      const date = new Date();
      // <div class="grid grid-cols-[max-content_auto]">
      //   <span class="font-semibold" style="color: ${config.search.placeholderTextColor}">&nbsp;=&nbsp;</span>
      //   <div class="text-ellipsis overflow-hidden whitespace-nowrap w-full" style="color: ${config.search.textColor}">
      //     ${new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", weekday: "long" }).format(date)}
      //   </div>
      // </div>

      const gridContainerEl = document.createElement("div");
      gridContainerEl.className = "grid grid-cols-[max-content_auto]";

      const spanEl = document.createElement("span");
      spanEl.className = "font-semibold";
      spanEl.style.color = config.search.placeholderTextColor;
      spanEl.innerHTML = "&nbsp;=&nbsp;";

      const dateTextEl = document.createElement("div");
      dateTextEl.className = "text-ellipsis overflow-hidden whitespace-nowrap w-full";
      dateTextEl.style.color = config.search.textColor;
      dateTextEl.textContent = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long"
      }).format(date);

      gridContainerEl.appendChild(spanEl);
      gridContainerEl.appendChild(dateTextEl);
      assistantContainerEl.appendChild(gridContainerEl);
    } else if (item.type === "math") {
      // <div class="grid grid-cols-[max-content_auto]">
      //   <span class="font-semibold" style="color: ${config.search.placeholderTextColor}">&nbsp;=&nbsp;</span>
      //   <div class="text-ellipsis overflow-hidden whitespace-nowrap w-full" style="color: ${config.search.textColor}">${item.result}</div>
      // </div>

      const gridContainerEl = document.createElement("div");
      gridContainerEl.className = "grid grid-cols-[max-content_auto]";

      const spanEl = document.createElement("span");
      spanEl.className = "font-semibold";
      spanEl.style.color = config.search.placeholderTextColor;
      spanEl.innerHTML = "&nbsp;=&nbsp;";

      const resultTextEl = document.createElement("div");
      resultTextEl.className = "text-ellipsis overflow-hidden whitespace-nowrap w-full";
      resultTextEl.style.color = config.search.textColor;
      resultTextEl.textContent = item.result.toString();

      gridContainerEl.appendChild(spanEl);
      gridContainerEl.appendChild(resultTextEl);
      assistantContainerEl.appendChild(gridContainerEl);

      const resultAsNum = parseFloat(item.result);
      if (
        typeof resultAsNum === "number" &&
        (resultAsNum >= 9007199254740991 || resultAsNum <= -9007199254740991)
      ) {
        // <div class="grid grid-cols-[max-content_auto]">
        //   <span class="font-semibold" style="color: ${config.search.placeholderTextColor}">&nbsp;*&nbsp;</span>
        //   <div class="text-ellipsis overflow-hidden whitespace-nowrap w-full" style="color: ${config.search.placeholderTextColor}">reduced precision</div>
        // </div>

        const gridContainerEl = document.createElement("div");
        gridContainerEl.className = "grid grid-cols-[max-content_auto]";

        const spanEl = document.createElement("span");
        spanEl.className = "font-semibold";
        spanEl.style.color = config.search.placeholderTextColor;
        spanEl.innerHTML = "&nbsp;*&nbsp;";

        const precisionTextEl = document.createElement("div");
        precisionTextEl.className = "text-ellipsis overflow-hidden whitespace-nowrap w-full";
        precisionTextEl.style.color = config.search.placeholderTextColor;
        precisionTextEl.textContent = "reduced precision";

        gridContainerEl.appendChild(spanEl);
        gridContainerEl.appendChild(precisionTextEl);
        assistantContainerEl.appendChild(gridContainerEl);
      }
    } else if (item.type === "definition") {
      item.result.definitions.slice(0, 3).forEach((def: any) => {
        // <div class="grid grid-cols-[max-content_auto]">
        //   <span class="font-semibold" style="color: ${config.search.placeholderTextColor}">&nbsp;-&nbsp;</span>
        //   <div class="w-full" style="color: ${config.search.textColor}">${def.definition} <span style="color: ${config.search.placeholderTextColor}">(${def.pos})</span></div>
        // </div>

        const gridContainerEl = document.createElement("div");
        gridContainerEl.className = "grid grid-cols-[max-content_auto]";

        const spanEl = document.createElement("span");
        spanEl.className = "font-semibold";
        spanEl.style.color = config.search.placeholderTextColor;
        spanEl.innerHTML = "&nbsp;-&nbsp;";

        const definitionEl = document.createElement("div");
        definitionEl.className = "w-full";
        definitionEl.style.color = config.search.textColor;
        definitionEl.innerHTML = `${def.definition} <span style="color: ${config.search.placeholderTextColor}">(${def.pos})</span>`;

        gridContainerEl.appendChild(spanEl);
        gridContainerEl.appendChild(definitionEl);
        assistantContainerEl.appendChild(gridContainerEl);
      });
    } else if (item.type === "conversion") {
      // <div class="w-full py-4">
      //   <div class="w-full grid grid-cols-[1fr_max-content_1fr] place-items-center" style="color: ${config.search.textColor}">
      //     <span style="color: ${config.search.textColor}">${item.before}</span>
      //     <span style="color: ${config.search.placeholderTextColor}">=></span>
      //     <span style="color: ${config.search.textColor}">${item.after}</span>
      //   </div>
      // </div>

      const outerContainerEl = document.createElement("div");
      outerContainerEl.className = "w-full py-4";

      const innerGridEl = document.createElement("div");
      innerGridEl.className = "w-full grid grid-cols-[1fr_max-content_1fr] place-items-center";
      innerGridEl.style.color = config.search.textColor;

      const beforeSpanEl = document.createElement("span");
      beforeSpanEl.style.color = config.search.textColor;
      beforeSpanEl.textContent = item.before;

      const arrowSpanEl = document.createElement("span");
      arrowSpanEl.style.color = config.search.placeholderTextColor;
      arrowSpanEl.textContent = "=>";

      const afterSpanEl = document.createElement("span");
      afterSpanEl.style.color = config.search.textColor;
      afterSpanEl.textContent = item.after;

      innerGridEl.appendChild(beforeSpanEl);
      innerGridEl.appendChild(arrowSpanEl);
      innerGridEl.appendChild(afterSpanEl);

      outerContainerEl.appendChild(innerGridEl);
      assistantContainerEl.appendChild(outerContainerEl);
    }

    if (index !== items.length - 1) {
      // <div class="w-full h-[1px] rounded-md my-auto" style="background-color: ${config.search.placeholderTextColor}"></div>

      const dividerEl = document.createElement("div");
      dividerEl.className = "w-full h-[1px] rounded-md my-auto";
      dividerEl.style.backgroundColor = config.search.placeholderTextColor;

      assistantContainerEl.appendChild(dividerEl);
    }
  });
};
