import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'
import { useRef, useState } from 'react'

const downloadStringAsFile = (data: string, filename: string) => {
  const a = document.createElement('a')
  a.download = filename
  a.href = data
  a.click()
}

export const App = () => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<HTMLDivElement>(null)

  const [text, setText] = useState('hallo world!')

  const onCanvasButtonClick = () => {
    const node = canvasRef.current?.children[0] as HTMLCanvasElement
    if (node == null) {
      return
    }
    // For canvas, we just extract the image data and send that directly.
    const dataURI = node.toDataURL('image/png')

    downloadStringAsFile(dataURI, 'qrcode-canvas.png')
  }

  const onSVGButtonClick = () => {
    const node = svgRef.current?.children[0] as SVGSVGElement
    if (node == null) {
      return
    }

    // For SVG, we need to get the markup and turn it into XML.
    // Using XMLSerializer is the easiest way to ensure the markup
    // contains the xmlns. Then we make sure it gets the right DOCTYPE,
    // encode all of that to be safe to be encoded as a URI (which we
    // need to stuff into href).
    const serializer = new XMLSerializer()
    const fileURI =
      'data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(
        '<?xml version="1.0" standalone="no"?>' +
          serializer.serializeToString(node)
      )

    downloadStringAsFile(fileURI, 'qrcode-svg.svg')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <h1>QR Codes</h1>

      <div className="flex w-[300px] items-center gap-4">
        <span>URL:</span>
        <input
          className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-800 shadow focus:outline-none dark:text-gray-200"
          type="text"
          value={text}
          onChange={({ target: { value } }) => setText(value)}
        />
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col justify-center">
          <div ref={canvasRef} className="rounded bg-white p-4">
            <QRCodeCanvas value={text} />
          </div>

          <button
            className="hover:underline"
            onClick={onCanvasButtonClick}
            style={{ display: 'block' }}
          >
            download png
          </button>
        </div>

        <div className="flex flex-col justify-center ">
          <div className="rounded bg-white p-4" ref={svgRef}>
            <QRCodeSVG value={text} />
          </div>

          <button
            className="hover:underline"
            onClick={onSVGButtonClick}
            style={{ display: 'block' }}
          >
            download svg
          </button>
        </div>
      </div>
    </main>
  )
}
