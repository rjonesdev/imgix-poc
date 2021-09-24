import './App.scss';
import { ImgixPicture } from './components/'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Imgix Proof of Concept</h1>
      </header>
      <div className="main">
        <hr />
        <h2>Single Image across all breakpoints</h2>
        <ImgixPicture 
          containerClasses='PagePhoto'
          imgName='frames-bases-plp-hero'
          imgExtension='png'
          altText='Testing resizable images'
          useLazyLoad={false}
          hasHoverImage={false}
          hasBreakpointImages={false}
          targetedDevices={[]}
        />
        <hr />
        <h2>Image with different images across breakpoints</h2>
        <ImgixPicture 
          containerClasses='PagePhoto'
          imgName='adjustable-base-setup'
          imgExtension='jpeg'
          altText='Multiple images across breakpoints'
          useLazyLoad={false}
          hasHoverImage={false}
          hasBreakpointImages={true}
        />
        <hr />
        <h2>Custom Image Parameters</h2>
        <h3>Height set to 300px</h3>
        <ImgixPicture 
          containerClasses='PagePhoto'
          imgName='setup-platform-bed'
          imgExtension='jpeg'
          altText='Multiple images across breakpoints'
          useLazyLoad={false}
          hasHoverImage={false}
          hasBreakpointImages={false}
          targetedDevices={[]}
          imgixParams={
            {
              h: 300
            }
          }
          />
          <h3>Width set to 400px</h3>
          <ImgixPicture 
            containerClasses='PagePhoto'
            imgName='setup-platform-bed'
            imgExtension='jpeg'
            altText='Multiple images across breakpoints'
            useLazyLoad={false}
            hasHoverImage={false}
            hasBreakpointImages={false}
            targetedDevices={[]}
            imgixParams={
              {
                w: 400
              }
            }
          />
        <hr />
        <h2>Ability to extend this to hover images</h2>
        <img
          src="hovercodeexample.png"
          alt="description of source lists"
          className="u-hidden--md-down"
        />
        <div className="spacer"></div>
      </div>
    </div>
  );
}

export default App;
