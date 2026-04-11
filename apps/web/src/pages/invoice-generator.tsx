import React, { useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/** White wordmark on transparent — header on `#405999` (`apps/web/public/kwik-fit-logo-header.png`) */
const KWIK_FIT_LOGO_HEADER = `${import.meta.env.BASE_URL}kwik-fit-logo-header.png`;
/** Coloured asset for faint watermark on white body (`apps/web/public/kwik-fit-logo.png`) */
const KWIK_FIT_LOGO_WATERMARK = `${import.meta.env.BASE_URL}kwik-fit-logo.png`;

const currency = (value: number) => `£${value.toFixed(2)}`;

const defaultData = {
  invoiceTitle: 'Retail Invoice',
  customer: {
    companyName: 'Hasan',
    postcode: 'G412AE',
    phone: '07448219744',
    invoiceDate: '02-Apr-2026 11:38',
  },
  vehicle: {
    reg: 'BN63ZTL',
    make: 'Ford',
    model: 'FIESTA ST',
    mileage: '100089',
    motDue: '06/24/2026',
  },
  centre: {
    name: 'Kwikfit (975)',
    address1: '381 Pollokshaws Rd, Pollokshaws',
    address2: '',
    address3: 'Glasgow',
    postcode: 'G41 1QZ',
    phone: '07448219744',
    printDate: '02-Apr-2026 11:38',
  },
  meta: {
    searchId: '136575777/97526107876/975',
    comments: 'kf76-12722171',
    page: 'Page 1 of 1',
  },
  items: [
    {
      part: 'BR205/45W17TR6XL',
      description: '205/45R17 BSTONE TUR6 95W XL EC',
      unitPrice: 49.85,
      qty: 4,
      vatCode: '1',
      note: 'Datasheet: eprel.ec.europa.eu/qr/501189',
    },
    { part: 'BAL', description: 'WHEEL BALANCE', unitPrice: 8.0, qty: 2, vatCode: '1' },
    { part: 'VAL', description: 'VALVE', unitPrice: 5.5, qty: 2, vatCode: '1' },
    { part: 'DISP', description: 'ECO TYRE DISPOSAL', unitPrice: 3.0, qty: 2, vatCode: '1' },
  ],
  discount: 24.3,
  vatRate: 0.2,
};

type InvoiceData = typeof defaultData;

function computeTotals(data: InvoiceData) {
  const subtotal = data.items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const gross = subtotal;
  const net = gross / (1 + data.vatRate);
  const vatElement = gross - net;
  return { gross, net, vatElement };
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[56px_1fr] leading-[1.2]">
      <div className="font-semibold">{label}</div>
      <div>{value}</div>
    </div>
  );
}

/* Generous cell padding so html2canvas/PDF doesn’t clip text against rules */
const thMainBase =
  'border-0 border-b border-black px-2.5 py-2 align-bottom text-[10px] font-bold text-black';
const thMain = `${thMainBase} text-left`;
const thMainRight = `${thMainBase} text-right`;
const tdMain = 'border-0 px-2.5 py-2 align-top text-left text-[10px] text-black';
const tdMainRight = 'border-0 px-2.5 py-2 align-top text-right text-[10px] text-black';
const tdNote = 'border-0 px-2.5 pb-2 pt-0 align-top text-[9px] leading-snug text-black';

const cellPadH = 'px-2.5 py-2';
const cellPadHRight = 'px-2.5 py-2 text-right';

export default function KwikFitInvoiceGenerator() {
  const [data] = useState(defaultData);
  const pageRef = useRef<HTMLDivElement>(null);
  const totals = useMemo(() => computeTotals(data), [data]);
  const vatPercentLabel = `${(data.vatRate * 100).toFixed(0)}%`;

  const downloadPdf = async () => {
    if (!pageRef.current) return;
    const canvas = await html2canvas(pageRef.current, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('kwik-fit-invoice.pdf');
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 bg-neutral-200 pt-40">
      <button
        type="button"
        onClick={downloadPdf}
        className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow"
      >
        Download PDF
      </button>

      <div
        ref={pageRef}
        className="relative w-[690px] overflow-hidden bg-white pb-0 pt-0 text-[10px] text-black shadow-xl [box-sizing:border-box]"
        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
      >
        {/* Watermark: centred, rotated ~17°, ~8% opacity */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
          <img
            src={KWIK_FIT_LOGO_WATERMARK}
            alt=""
            className="absolute left-1/2 top-[46%] max-w-none opacity-[0.08]"
            style={{
              width: '560px',
              height: 'auto',
              transform: 'translate(-50%, -50%) rotate(-17deg)',
            }}
          />
        </div>

        <div className="relative z-[1]">
          <div className="flex h-[84px] w-full min-w-full items-center justify-end bg-[#405999] px-6">
            <img
              src={KWIK_FIT_LOGO_HEADER}
              alt="Kwik Fit"
              width={600}
              height={120}
              className="block h-10 w-auto max-h-[44px] object-contain object-right"
              decoding="async"
            />
          </div>

          <div className="px-6 pb-2 pt-4">
            <div className="text-center text-[18px] font-bold leading-none text-black">{data.invoiceTitle}</div>

            <div className="mt-3 grid grid-cols-3 gap-x-8 text-[10px] leading-[1.35]">
              <div>
                <Row label="Customer" value="" />
                <Row label="Company" value="" />
                <Row label="Name" value={data.customer.companyName} />
                <div className="h-[20px]" />
                <Row label="PostCode" value="" />
                <Row label="Phone" value={data.customer.phone} />
                <Row label="Inv. Date" value={data.customer.invoiceDate} />
              </div>

              <div>
                <Row label="Vehicle" value="" />
                <Row label="Reg" value={data.vehicle.reg} />
                <Row label="Make" value={data.vehicle.make} />
                <Row label="Model" value={data.vehicle.model} />
                <Row label="Mileage" value={data.vehicle.mileage} />
                <Row label="MOT Due" value={data.vehicle.motDue} />
              </div>

              <div>
                <Row label="Centre" value="" />
                <Row label="Name" value={data.centre.name} />
                <div className="pl-[56px] leading-[1.2]">
                  <div>{data.centre.address1}</div>
                  <div>{data.centre.address2}</div>
                  <div>{data.centre.address3}</div>
                </div>
                <Row label="PostCode" value={data.centre.postcode} />
                <Row label="Phone" value={data.centre.phone} />
                <Row label="Print Date" value={data.centre.printDate} />
              </div>
            </div>

            <div className="mt-3 flex justify-end pr-6 text-[10px]">
              <span className="mr-4">SearchId/PosRef/InvNo</span>
              <span>{data.meta.searchId}</span>
            </div>

            {/* Main lines: top rule, rule under header, rule after last item — no vertical borders */}
            <table className="mt-3 w-full border-collapse border-t border-black text-black [border-spacing:0]">
              <thead>
                <tr className="border-b border-black">
                  <th className={thMain}>Part</th>
                  <th className={thMain}>Description (front/rear tyre pressures if applicable)</th>
                  <th className={thMainRight}>Unit Price</th>
                  <th className={thMainRight}>Qty</th>
                  <th className={thMainRight}>Line Price</th>
                  <th className={`${thMainRight} pr-0`}>Vat Code</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, idx) => {
                  const linePrice = item.unitPrice * item.qty;
                  return (
                    <React.Fragment key={`${item.part}-${idx}`}>
                      <tr>
                        <td className={tdMain}>{item.part}</td>
                        <td className={tdMain}>{item.description}</td>
                        <td className={tdMainRight}>{currency(item.unitPrice)}</td>
                        <td className={tdMainRight}>{item.qty}</td>
                        <td className={tdMainRight}>{currency(linePrice)}</td>
                        <td className={`${tdMainRight} pr-0`}>{item.vatCode}</td>
                      </tr>
                      {item.note ? (
                        <tr>
                          <td className={tdNote} />
                          <td className={tdNote} colSpan={5}>
                            {item.note}
                          </td>
                        </tr>
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
            {/* Closing horizontal rule under items (separate block so it always sits flush) */}
            <div className="h-0 w-full border-b border-black" />

            {/* Two separate bordered total rows (reference layout) */}
            <div className="mt-4 flex flex-col items-end gap-2 pr-1">
              <div className="flex w-[435px] border border-black text-[10px] text-black">
                <div className="min-h-[36px] flex-1 px-3 py-2.5">Invoice Amount Incl. VAT</div>
                <div className="flex min-h-[36px] w-[140px] items-center justify-end border-l border-black px-3 py-2.5">
                  {currency(totals.gross)}
                </div>
              </div>
              <div className="flex w-[435px] border border-black text-[10px] text-black">
                <div className="min-h-[36px] flex-1 px-3 py-2.5">Including a discount of</div>
                <div className="flex min-h-[36px] w-[140px] items-center justify-end border-l border-black px-3 py-2.5">
                  {currency(data.discount)}
                </div>
              </div>
            </div>

            {/* Payments: top rule, rule under header row, bottom rule — no vertical lines */}
            <div className="ml-[170px] mt-4 w-[220px] text-[10px] leading-[1.35] text-black">
              <div className="font-bold">Payments</div>
              <table className="mt-1 w-full border-collapse border-t border-black text-black [border-spacing:0]">
                <thead>
                  <tr className="border-b border-black">
                    <th className={`w-[72px] text-left text-[10px] font-normal ${cellPadH}`}>Amount</th>
                    <th className={`text-left text-[10px] font-normal ${cellPadH}`}>Tender</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-black">
                    <td className={`text-[10px] ${cellPadH}`}>{currency(totals.gross)}</td>
                    <td className={`text-[10px] ${cellPadH}`}>Voucher</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* VAT Analysis: same horizontal-line treatment as main items table */}
            <div className="ml-[170px] mt-3 w-[410px] text-[10px] leading-[1.3] text-black">
              <div className="font-bold">Vat Analysis</div>
              <table className="mt-1 w-full border-collapse border-t border-black text-black [border-spacing:0]">
                <thead>
                  <tr className="border-b border-black">
                    <th className={`w-[72px] text-left text-[10px] font-normal ${cellPadH}`}>Vat Rate</th>
                    <th className={`w-[56px] text-left text-[10px] font-normal ${cellPadH}`}>Vat Code</th>
                    <th className={`text-right text-[10px] font-normal ${cellPadHRight}`}>Net Amount</th>
                    <th className={`text-right text-[10px] font-normal ${cellPadHRight}`}>Vat Element</th>
                    <th className={`text-right text-[10px] font-normal ${cellPadHRight}`}>Gross Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-black">
                    <td className={`text-[10px] ${cellPadH}`}>{vatPercentLabel}</td>
                    <td className={`text-[10px] ${cellPadH}`}>1</td>
                    <td className={`text-[10px] ${cellPadHRight}`}>{currency(totals.net)}</td>
                    <td className={`text-[10px] ${cellPadHRight}`}>{currency(totals.vatElement)}</td>
                    <td className={`text-[10px] ${cellPadHRight}`}>{currency(totals.gross)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-2 grid grid-cols-[75px_1fr]">
                <div>Vat Number</div>
                <div>380 0948 50</div>
              </div>
            </div>

            <div className="mt-4 flex text-[10px] text-black">
              <div className="mr-1 font-bold">Comments:</div>
              <div>{data.meta.comments}</div>
            </div>

            <div className="h-[240px]" />

            <div className="text-[10px] leading-[1.15] text-[#6a79a7]">
              <div className="font-bold text-[#6a79a7]">
                Please keep this important document in a safe place should you need proof of quotation or purchase.
              </div>
              <div>
                A company registered in England and Wales. Registered Office: Kwik-Fit (GB) Limited, ETEL House, Avenue
                One, Letchworth Garden City,
              </div>
              <div>Hertfordshire SG6 2HU Reg. No. 1099184</div>
              <div className="mt-2">VAT REGISTRATION No. 380 0948 50</div>
            </div>

            <div className="mt-1 text-right text-[10px] font-bold text-black">{data.meta.page}</div>
          </div>
        </div>

        <div className="relative z-[1] flex h-[28px] w-full min-w-full items-center justify-between bg-[#405999] px-7 text-[11px] tracking-[0.2px]">
          <div>
            <span className="font-bold text-[#f6b11b]">PLEASE SEE REVERSE </span>
            <span className="text-white">FOR IMPORTANT INFORMATION</span>
          </div>
          <div className="font-bold text-[#f6b11b]">www.kwik-fit.com</div>
        </div>
      </div>
    </div>
  );
}
