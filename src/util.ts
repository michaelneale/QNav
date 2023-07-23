import { Web5 } from "@tbd54566975/web5";
import { Web5Connection } from "./types";
import { qGoProtocol } from "./protocols";

export async function configureProtocol(web5: Web5, protocolDefinition: any) {
  const { protocols, status } = await web5.dwn.protocols.query({
    message: {
      filter: {
        protocol: protocolDefinition.protocol,
      },
    },
  });

  if (status.code !== 200) {
    alert("Failed to query protocols. check console");
    console.error("Failed to query protocols", status);

    return;
  }

  // protocol already exists
  if (protocols.length > 0) {
    console.log("protocol already exists");
    return;
  }

  // create protocol
  const { status: configureStatus } = await web5.dwn.protocols.configure({
    message: {
      definition: protocolDefinition,
    },
  });

  console.log("configure protocol status", configureStatus);
}

export async function linksRecordsQuery(web5: Web5) {
  const recordsRes = await web5.dwn.records.query({
    message: {
      filter: {
        protocol: qGoProtocol.protocol,
        schema: "qGoLinkSchema",
        dataFormat: "application/json",
      },
      // TODO: import proper enum to avoid having to ts-ignore
      // @ts-ignore
      dateSort: "createdDescending",
    },
  });
  return recordsRes;
}

export async function connectWeb5() {
  const web5: Web5Connection = await Web5.connect({});
  web5.web5 && await configureProtocol(web5.web5, qGoProtocol);
  return web5;
}

export function getActiveTabUrl(callback: (url: string) => void) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      const activeTabUrl = tabs[0].url;
      console.log("URL of the active tab:", activeTabUrl);
      // You can now use the URL as needed
      callback(activeTabUrl || "")
    }
  });
}