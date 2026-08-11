//#region arquivo temporario
const ps2 = new Uint8Array([
    0x50, 0x53, 0x32,//ps2

    0x02,//largura
    0x02,// altura

    0xFF, 0x00, 0x00, 0xFF, //RGBA
    0x00, 0xFF, 0x00, 0xFF,
    0x00, 0x00, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF
])

//#region criar arquivo
const commit_ps2 = new Blob(
    [ps2],
    {type:"application/octet-stream"}
)

const id_link = document.getElementById("link_dowload")
id_link.href = URL.createObjectURL(commit_ps2)
id_link.download = "imagem.ps2";
URL.revokeObjectURL(id_link.href)


//pegar arquivo
const arquvio_input = document.getElementById("arquivo")
arquvio_input.addEventListener("change", async(e)=>{
    const _arquivo = event.target.files[0]
    const date = await _arquivo.arrayBuffer();
    const bytes = new Uint8Array(date)
    
    parser(bytes)
    
    
})
//#endregion

//#region programa que ler a nova extensão
function parser(extension){
    const signature = [extension[0], extension[1], extension[2]]
    const size = [extension[3], extension[4]]
    let obj_ext = {
        signature: signature,
        size: size,
        pixel:[]
    }

    if (signature[0] === 0x50 && signature[1] === 0x53 && signature[2] === 0x32) {
           console.log("arquivo PS2");

 
        //--dimensão
        const max_size = size[0] * size[1]


        //--pixels
        for (let i = 0; i < max_size; i++) {

            const _start_p = 5 + (i * 4);

            const _red = extension[_start_p];
            const _green = extension[_start_p + 1];
            const _blue = extension[_start_p + 2];
            const _alpha = extension[_start_p + 3] 
            
            const pixel = {
                R: _red,
                G: _green,
                B: _blue,
                A: _alpha
            };

            obj_ext.pixel.push(pixel)

        }
        console.log("obj: ",obj_ext);
        console.log("extensão do gabriel funcionando");

        const id_span =document.getElementById("text")
        
        const texto = obj_ext.signature
            .map(byte => String.fromCharCode(byte))
            .join('');
        id_span.innerText = `
        extenção arquivo: .${texto}
        largura: ${obj_ext.size[0]}
        altura: ${obj_ext.size[0]}
        `
        canvas(obj_ext)
   }else{
    console.log("Erro: não encontrado");
    
   }
}
//#endregion

//#region canvas
function canvas(obj) {

    const canvas = document.getElementById("windows");
    const ctx = canvas.getContext("2d");

    const largura = obj.size[0];
    const altura = obj.size[1];

    const tamanhoPixel = 50;


    const larguraImagem = largura * tamanhoPixel;
    const alturaImagem = altura * tamanhoPixel;

    const offsetX = (canvas.width - larguraImagem) / 2;
    const offsetY = (canvas.height - alturaImagem) / 2;


    obj.pixel.forEach((pixel, i) => {

        const r = pixel.R;
        const g = pixel.G;
        const b = pixel.B;
        const a = pixel.A;

        const x = i % largura;
        const y = Math.floor(i / largura);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;

        ctx.fillRect(
            offsetX + (x * tamanhoPixel),
            offsetY + (y * tamanhoPixel),
            tamanhoPixel,
            tamanhoPixel
        );
    });
}
//#endregion