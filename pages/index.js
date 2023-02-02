import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Source_Sans_Pro } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Footer from '../components/Footer'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { signIn } from 'next-auth/react'
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { Fade } from 'react-reveal'

const sourceSans = Source_Sans_Pro({ subsets: ['latin'],display: "fallback", weight:"600" })

const FILE_SIZE_LIMIT = 2

export default function Home() {
  const {data: session} = useSession()

  const [quoteReq, setQuoteReq] = useState({
    email: "",
    name: "",
    number: "",
    message: "",
  })

  const [isError, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileNames, setFileNames] = useState([])

  const [showPdf, setShowPdf] = useState(1)
  const [isAdminDevice, setAdminDevice] = useState(false)

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const sendMail = async () => {

    let base64Images = []

    for (var i = 0; i < selectedFiles.length; i++){
      const newImageUrl = await toBase64(selectedFiles[i])
      base64Images.push(newImageUrl)
    }




    // if (!validateFileSize()){
    //   alert("File cannot be larger than 5 MB.")
    //   return
    // }
    // Fetch email.js api and send quoteReq as part of body

    const response = await fetch('/api/sendQuoteRequest', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 
          attachments:base64Images,
          attachmentNames: fileNames,
          quoteReq: quoteReq,
        }
      ),
      
    });
    const data = await response.json();
    
    toast.success('Your Quote has been sent. Please allow 2-3 business days for us to get back to you!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  }

  const handleFilesChange = (event) => {

    if (event.target.files.length > 3){
      event.preventDefault();
      toast.error('You can upload up to 3 images.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      setErrorMsg(" - You can upload up to 3 images")
      setError(true)
      setFileNames([])
      return
    }

    if (event.target.files.length > 0){

      const files = [...event.target.files]

      let filesAreSmall = true

      files.forEach(file => {
        if (!validateFileSize(file)){
          filesAreSmall = false
        }
      });

      if (filesAreSmall){
        setSelectedFiles(files);
        setFileNames(files.map(file=>file.name))
        setError(false)

      }
      else{
        event.preventDefault();
        toast.error('Files must be smaller than 5 MB.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        setErrorMsg(" - Files must be smaller than 5 MB")
        setError(true)
        setFileNames([])
      }

    }
  };


  const validateFileSize = (file) =>{
    if (!file) {
      
      return
    }

    const fileSize = Math.floor(file.size / 1048576)

    if(fileSize > FILE_SIZE_LIMIT-1){

      // Send to big toast
      return false
    }
    return true
  }

  const handleQuoteChange = (key, value) => {
    setQuoteReq(prev => {
      return (
        {
          ...prev,
          [key]: value
        }
      )
    })
  }

  useEffect(()=>{
    const potentialAdmin = localStorage.getItem("potentialAdmin")
    const admin = localStorage.getItem("admin")

    if (potentialAdmin || admin){
      setAdminDevice(true)
    }
  },[])

  // const isMobile = useMediaQuery('(max-width: 768px)')
  
  const login = () =>{
    localStorage.removeItem("potentialAdmin")
    signIn("auth0")
  }

  return (
    <>
      <Head>
        <title>Cabinets Southwest</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
        
      </Head>
      <ToastContainer/>
      <main className={"container "+sourceSans.className}>
      
        {
          session?
          <div className='position-absolute top-0 end-0 me-3 mt-3'>
            <Link className='btn btn-dark box-shadow' href={'/admin'}>Admin Page</Link>
          </div>
          :
          <>
            {
              isAdminDevice && <div className='position-absolute top-0 end-0 me-3 mt-3'>
              <button className='btn btn-dark box-shadow' onClick={()=>login()}>Sign In</button>
            </div>
            }
          </>
          
        }
      
        <Fade>
          <div className='col col-md-6 mx-auto position-relative mb-5 mx-auto mt-5 text-center' style={{minHeight:"100px"}}>
            <Image
              src={'/swc_logo_final_color.webp'}
              alt="logo"
              objectFit={'contain'}
              width = {256}
              height = {100} 
            />  
          </div>
        </Fade>
      
        <Fade>
          <hr/>
        </Fade>
      
        <Fade>
          <div className='mb-4 d-flex flex-column justify-content-center'>
            <h2 className='text-center mt-2 h1'>About Us</h2>
            <p className='fs-3 col-lg-8 col mx-auto'>
            Cabinets Southwest is a full-service supplier of high-value fully-featured cabinetry.  We are very proud of our products and wanted to share with you some of our product features:
            </p>
            <ul className='col-lg-6 mx-auto col fs-4'>
              <li> All plywood construction</li>
              <li> 5/8” hardwood / dovetail drawer boxes</li>
              <li> Undermount / Full-Extension / Soft-close drawer guides</li>
              <li> Full-Overlay Fronts</li>
              <li> 5-Piece Drawer Fronts</li>
              <li> Soft-close hinges</li>
              <li> ¾” Plywood shelves</li>
              <li> 24 on trend styles and colors</li>
              <li> 2 week lead times</li>
              <li> Sherwin-Williams custom color program</li>
            </ul>

            <p className='fs-3 col-lg-8 col mx-auto mb-0'>
              In addition to our fantastic products, we offer a full service lineup including design, renderings, order entry, job site delivery, assembly and installation!

              We would love to earn your business!  If there is anything that we can do for you, please let us know.

            </p>
          </div>
        </Fade>

        <Fade>
          <hr/>
        </Fade>
      
        
      <div className='mt-3'>
        
        <Fade>
          <h2 className='text-center mb-3 mt-4 h1'>Documents</h2>

          <div className="w-100 text-center mb-1" >
            <button 
              className={"btn rounded-0 rounded-start btn-outline-dark box-shadow "+(showPdf===1?" btn-dark text-light":"")}
              onClick={()=>setShowPdf(1)}
            >
              Styles And Colors
            </button>
            <button 
              className={"btn rounded-0 rounded-end btn-outline-dark box-shadow "+(showPdf===2?" btn-dark text-light":"")}
              onClick={()=>setShowPdf(2)}
            >
              2023 Catalog
            </button>          
          </div>

          <div className='mb-3 d-flex flex-column justify-content-center text-center'>
          
            {/* <PdfLoader /> */}
            <div className='w-100'>
              {
                showPdf === 1?
                <div                 
                  className='position-relative col-lg-8 col mx-auto ' 
                >
                  <iframe className='border rounded-5 border-dark box-shadow'  src="https://drive.google.com/file/d/1izMNwGY1u1sfx_g0pACdNpgArdbtQ2J7/preview" style={{height:"100vh",width:"100%"}} ></iframe>
                  {
                    (true) &&
                    <a 
                      className='position-absolute bottom-0 end-0 me-4 mb-3 btn btn-dark box-shadow'
                      href='./Styles And Colors.pdf'
                      download
                    >
                      Download
                    </a>
                  }
                </div>
                :
                <div 
                  className='position-relative col-lg-8 col mx-auto' 
                >
                  <iframe className='border rounded-5 border-dark box-shadow'  src="https://drive.google.com/file/d/1x5N3eXXvSQUezDbPKc8IeZv3_B2pzOo1/preview" style={{height:"100vh",width:"100%"}} ></iframe>

                  {
                    (true) &&
                    <a 
                      className='position-absolute bottom-0 end-0 me-4 mb-3 btn btn-dark box-shadow'
                      href='./Catalog 2023.pdf'
                      download
                    >
                      Download
                    </a>
                  }
                </div>              
              }
            </div>
          </div>

        </Fade>

        <Fade>
          <hr/>
        </Fade>

        <Fade>
          <h2 className='text-center mb-3 mt-4 h1'>Request A Quote</h2>

          <div className='mb-4 col col-lg-8 mx-auto col col-lg-8 mx-auto d-flex flex-column'>

            <span className='text-center mb-3 fs-3'>Fill out this form to request a quote from us:</span>

            <div className=' border p-3 rounded-3 bg-light d-flex flex-column box-shadow'>
              <div className="mb-3">
                <label className="form-label">Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="John Doe"
                  value={quoteReq.name}
                  onChange={(evt)=>handleQuoteChange("name",evt.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email address *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="jdoe@email.com"
                  value={quoteReq.email}
                  onChange={(evt)=>handleQuoteChange("email",evt.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Number</label>
                <input 
                  type="phone" 
                  className="form-control" 
                  placeholder="123-456-7890"
                  value={quoteReq.number}
                  onChange={(evt)=>handleQuoteChange("number",evt.target.value)}
                />
              </div>
              <div className="mb-3">
                <label >Description</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder='I need a quote for a ...'
                  value={quoteReq.messege}
                  onChange={(evt)=>handleQuoteChange("messege",evt.target.value)}
                >
                </textarea>
              </div>

              <div className="mb-3">
                <label className={"form-label "+(isError?"text-danger fw-bold":"")}>Attachments{isError?errorMsg:""}</label>
                <input
                  className="form-control" 
                  type="file"
                  accept="image/*"
                  // value={fileNames.length>0?fileNames.toString():""} 
                  onChange={handleFilesChange}
                  multiple
                />
              </div>
              <button 
                className='btn btn-dark col-lg-6 col-12 mx-auto box-shadow' 
                onClick={sendMail}
                disabled = {isError}
              >
                Send
              </button>

            </div>
          </div>
        </Fade>

        <Fade>
          <hr/>
        </Fade>

        <Fade>
          <h2 className='text-center mt-4 h1'>Contact Us</h2>

          <div className='col col-lg-8 mx-auto'>
            <p className='fs-3 mx-auto mb-0 text-center'>
              Feel free to reach out to Jeff Norman directly at <a href='mailto:jnorman@cabinetssouthwest.com' className='text-nowrap text-dark'>jnorman@cabinetssouthwest.com</a> or call <a href = "tel:1-480-226-8157" className='text-dark text-nowrap'>480-226-8157</a>.
            </p>
          </div>
        </Fade>

        <Fade>
          <Footer/>
        </Fade>
      </div>

    </main>
  </>
  )
}
