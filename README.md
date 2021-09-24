# Imgix Spike [(PD-9874)](https://saatva.atlassian.net/browse/PD-9874?atlOrigin=eyJpIjoiNjVmNmU5YjEwNjg5NDBhMmI5NDMwMDA5ZjhlNTJjNDUiLCJwIjoiaiJ9)

## Resources
A collection of miscellaneous resources that I've used in the creation of this document/proof of concept. 
* [Imgix Documentation](https://docs.imgix.com/)
* [List of URL Parameters for Imgix's Rendering API](https://docs.imgix.com/apis/rendering?_ga=2.255519617.862398465.1631648599-597823948.1631222504)

# Imgix Features of Note

## Imgix Image Manager (for non-devs)
This image manager is going to be primary way for non developers to upload, tag, and set up images to be used as assets. 

### Uploading an Image to Image Manager
1. Navigate to the [Imgix Dashboard](dashboard.imgix.com), and click "Images" on the top navigation bar.
2. Click "UPLOAD" in the top right corner
3. Select the image you want to upload into Imgix (*note* files can not have a duplicate name within imgix)
4. Specify the destination path (you can set a folder structure or leave it blank in which case the file will be saved to the `/` root directory)
5. The upload manager will show the queued uploads and will move your image to finished as soon as it is uploaded and usable.

### Sorting/Categorizing Images in the Image Manager
1. Navigate to the [Imgix Dashboard](dashboard.imgix.com), and click "Images" on the top navigation bar.
2. Search for an image (or filter using the advanced search options) using one of the available search options
    - Filename
    - File Path
    - File Tag(s)
    - File Category
3. Clicking on an image will open that asset's detail panel on the right side of the screen
4. The image detail panel will show a thumbnail of the image, the link to the base image, metadata about its size, as well as its categories and custom field information
5. Adding Categories
    - Under an image detail panel, expand the categories dropdown
    - Click add category (you can add as many as you'd like at once)
    - Once you've added all the categories you want to create click save and they'll be saved for use in other images and added to the currently selected image
        - In order to add a category that already exists, click the dropdown arrow next to "Select a category" and search through the search box that pops up
    - *If an image already has categories, you won't see Add and will instead see Edit*
6. Adding custom attributes
    - You can add any key-value pair of custom attributes to an image (that can be used to search for it later)

### Interesting findings Re: Image Manager
- The imgix management dashboard seems to be somewhat slow to do searching and fetching of categories and/or custom tags. I don't know if this is going to present issues in the long term with scale but its just something to point out.
- The utilities for sorting images are extensive, but they rely on utilizing common convention which is prone to people error if the proper process isn't followed
- There are utilities for searching for images by path, but that is only the image path on the actual S3 bucket and there appears to be no way to sort visually by folders unless you already know the folders that exist. (this may not be as big of an issue if tags are used consistently but it's worth pointing out)
    - You can search (and store) based on a path, but that only affects the S3 bucket. You can search by a path in the images dashboard but you can't "explore" folders on the S3 bucket which might become a pain point, but not sure if folders are even important to use in our usecase.

## Imgix [NPM Package](https://docs.imgix.com/libraries/js-core)
- The imgix npm package can be used to create image sourcesets for use in a `<picture>` element. 
- Using the library, you can supply a path to an image and then create _either_ a single URL or a sourceset of different versions of that image (using `ImgixClient.buildUrl` and `ImgixClient.buildSrcSet` respectively)
    - Any of the URL parameters in the Imgix Rendering API can also be utilized through the NPM package

### Misc Notes
1. It is possible to add a custom subdomain on top of imgix if that is desired (this would enable images to be at `img.saatva.com` or something similar instead of `saatva.imgix.net`)
2. Can set default image and error image in order to help with graceful failure. 
    - Default image overrides Error Image
    - If default image is set, `404` (for missing image) will instead return `200` status code and the default image
    - If error image is set, any request that would return _either_ a `4xx` or `5xx` error will return the appropriate error code but will include the default error image
    - Errors don't count towards request quota, but Default images do. (basically it counts towards request quota if the response returns a `2xx` status code)

# Implementation

## Refactor of the Existing `<Picture/>` Component

## Considerations to keep in mind
- The breakpoints/sizes we'll use to generate source sets CAN be fixed if we have a set of preferred image sizes, but if that's not the case we can also decide on preferred aspect ratios at breakpoints and those can be used as the enclosing parameters to decide the limits of the sourceset
## Potential Issues in Implementation 
- With respect to refactoring the SCSS mixin that already exists, it may be difficult to use the ImgixClient from the NPM package to generate the URL's it uses without doing some significant rethinking of how the mixin is used in the first place, but there will need to be more research into that specifically
    - The potential issue I can forsee is that a refactor of the mixin may basically entail changing whats currently there to just be different imgix URLs instead of different file names, but that can be investigated in the future. 