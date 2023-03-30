import scrapeIt from 'scrape-it';
import type { Server } from '../types.js';
import { cleanupText } from './_utils.js';

export const scrapeServers = async () => {
  const url = 'https://eco.ovhcloud.com/en/#filterType=range_element';

  const { data, status } = await scrapeIt<{ servers: Server[] }>(url, {
    servers: {
      listItem: '[data-product=data-product]',
      data: {
        id: {
          attr: 'data-product-id',
        },
        model: {
          selector: '[data-product-specs=""] > div',
          attr: 'data-plancode',
        },
        provider: {
          selector: '.ods-badge--default',
        },
        cpu: {
          selector: '[data-product-specs=""] > div > div:nth-child(1)',
          convert: (x: string) =>
            cleanupText(x).replace('CPU:', '').split(' - ')[0]?.trim(),
        },
        cpuCores: {
          selector: '[data-product-specs=""] > div > div:nth-child(1)',
          convert: (x: string) =>
            cleanupText(x).replace('CPU:', '').split(' - ')[1]?.trim(),
        },
        cpuFreq: {
          selector: '[data-product-specs=""] > div > div:nth-child(1)',
          convert: (x: string) =>
            cleanupText(x).replace('CPU:', '').split(' - ')[2]?.trim(),
        },
        ram: {
          selector: '[data-product-specs=""] > div > div:nth-child(2)',
          convert: (x: string) => cleanupText(x).replace('Memory:', '').trim(),
        },
        disk: {
          selector: '[data-product-specs=""] > div > div:nth-child(3)',
          convert: (x: string) => cleanupText(x).replace('Storage:', '').trim(),
        },
        network: {
          selector: '[data-product-specs=""] > div > div:nth-child(4)',
          convert: (x: string) =>
            cleanupText(x).replace('Public bandwidth:', '').trim(),
        },
        priceMonthly: {
          selector: '.ods-product-information-preview__price-1 .price-value',
          eq: 1,
          convert: (x: string) => Number(x.replace('$', '')),
        },
        installationFee: {
          selector: '.ods-product-information-preview__fees .price-value',
          convert: (x: string) => Number(x.replace('$', '')),
        },
      },
    },
  });

  return {
    servers: data.servers,
    status,
  };
};
