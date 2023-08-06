
import type { V2_MetaFunction, ActionArgs } from "@remix-run/node";
import { Form, useActionData, useTransition, useNavigation } from "@remix-run/react";
import { json } from "@remix-run/node";
import axios from "axios";
import { useEffect, useState } from "react";
import { JsonViewer } from '@textea/json-viewer'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'

import { LinkButton } from "~/components/LinkButton";
import { FormGroup } from "~/components/FormGroup";
import { FileUpload } from "~/components/FileUpload";
import { InputGroup } from "~/components/InputGroup";
import { RadioInputGroup } from "~/components/RadioInputGroup";
import { SubmitButton } from "~/components/SubmitButton";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { Alert } from "~/components/Alert";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

type ResponseErr = {
  status?: number,
  error?: object
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  try {
    const {data} = await axios.postForm('https://api.unstructured.io/general/v0/general', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'accept': 'application/json',
        'unstructured-api-key': process.env.API_KEY
      }
    })
    return json(data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let data: ResponseErr = {
        status:error.status,
        error: error?.response?.data
      }
      return json(data)
    }
    return json (error)
  }

};

export default function Index() {
  const transition = useNavigation()
  const data = useActionData<typeof action>();
  const [dataDownload, setDataDownload] = useState<string>('')

  const submitText =
  transition.state === "submitting"
    ? "Sending..."
    : transition.state === "loading"
    ? "Processing!"
    : "Process selected documents";

  const resultPlaceholder =
  transition.state === "submitting"
    ? <LoadingSpinner />
    : `<p><i>Upload files to see results</i></p>`;

  useEffect(() => {
    if (data) {
      const blob = new Blob([ JSON.stringify(data) ], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      setDataDownload(url)
    }
  }, [data])

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Unstructured.io API GUI</h1>
          </div>
        </header>
        <main>
          {
            data?.error && (
              <Alert 
                header="Looks like something went wrong..." 
              >
                <ul role="list" className="list-disc space-y-1 pl-5">
                  {data.error.detail.map((err: any, i: number) => {
                    return (
                    <li key={`error-${err.type}-${i}`}>
                      <p className="font-md">{err.type}</p>
                      <p>{err.msg}</p>
                    </li>
                    )
                  })}
                </ul>
               </Alert>
            )
          }
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 p-4 ">
              <Form method="post" encType="multipart/form-data">

                  <FormGroup disabled={transition.state === 'submitting'}>
                    <InputGroup>
                      <FileUpload />
                    </InputGroup>
                    <InputGroup>
                      <RadioInputGroup 
                        name="strategy"
                        legend="Strategy" 
                        helper="Four strategies are available for processing PDF/Images files: hi_res, fast, ocr_only, and auto. fast is the default strategy and works well for documents that do not have text embedded in images." 
                        defaultValue="fast"
                        options={[
                        {
                          value: 'fast',
                          label: 'Fast',
                          helper: 'Default'
                        },
                        {
                          value: 'hi_res',
                          label: 'High Resolution',
                          helper: 'the better choice for PDFs that may have text within embedded images, or for achieving greater precision of element types in the response JSON.'
                        },
                        {
                          value: 'ocr_only',
                          label: 'OCR Only',
                          helper: 'Runs the document through Tesseract for OCR. Currently, hi_res has difficulty ordering elements for documents with multiple columns.'
                        },
                        {
                          value: 'auto',
                          label: 'Auto',
                          helper: 'The best of all worlds, auto will determine when a page can be extracted using fast or ocr_only mode, otherwise, it will fall back to hi_res.'
                        },
                      ]} /> 
                    </InputGroup>
                    <InputGroup>
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                              <span>Additional Settings <i>(optional)</i></span>
                              <ChevronUpIcon
                                className={`${
                                  open ? 'rotate-180 transform' : ''
                                } h-5 w-5 text-purple-500`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">

                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </InputGroup>
                    <InputGroup>                  
                        <SubmitButton disabled={transition.state === 'submitting'} label={submitText} />
                    </InputGroup>
                  </FormGroup>
              </Form>
              <div className="">
                  {
                    (data && transition.state === 'idle') && (
                      <div className="mb-5">
                        <LinkButton href={dataDownload} download={true} label="Download output as JSON">
                          Download JSON
                        </LinkButton>
                      </div>
                    )
                  }
                  <div className="flex overflow-auto items-center justify-center rounded-b-lg text-sm leading-[1.5714285714] text-white sm:rounded-t-lg language-jsx bg-slate-900 whitespace-break-spaces h-full max-h-[80vh]">
                    { (data && transition.state === 'idle') ? 
                      <JsonViewer className="p-5 h-full w-full overflow-auto" value={data} theme={'dark'} /> : 
                      <div>
                        {resultPlaceholder}
                      </div>
                    }
                  </div>
              </div>
            </div>
          </div>
        </main>
    </div>
  );
}
