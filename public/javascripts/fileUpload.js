const rootStyle = window.getComputedStyle(document.documentElement)

if( rootStyle.getPropertyValue('--book-cover-width-large') != null  && rootStyle.getPropertyValue('--book-cover-width-large') != '') {
    ready()
} else {
    document.getElementById('main-css').addEventListener('load', ready)
}

function ready (){
    const coverWidth = parseFloat(rootStyle.getPropertyValue('--book-cover-width-large'))
    const coverrRatio =parseFloat(rootStyle.getPropertyValue('--book-cover-aspert--book-cover-ratio-large'))
    const coverHeight = coverWidth / coverrRatio
    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode
    )
    FilePond.parse(document.body);
    
    FilePond.setOptions({
        stylePanelAspectRatio: 1 / coverrRatio,
        setResizeTargetWidth: coverWidth,
        setResizeTargetHeight: coverHeight,
    })
}

