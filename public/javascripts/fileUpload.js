FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
)
FilePond.parse(document.body);


const inputElement = document.querySelector('input[type="file"]')
const pond = FilePond.create(inputElement)