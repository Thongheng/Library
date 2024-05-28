FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
)
FilePond.parse(document.body);

FilePond.setOptions({
    stylePanelAspectRatio: 150 / 100,
    setResizeTargetWidth: 100,
    setResizeTargetHeight: 150,
    
})