const bgColorMap = {
    Error: 'Crimson',
    Activity: 'CadetBlue',
    InstrumentedEvent: 'DarkOliveGreen',
    O11ySample: 'BlueViolet'
}
const colorMap = {
    Error: 'white',
    Activity: 'white',
    InstrumentedEvent: 'white',
    O11ySample: 'white'
}
const defaultColor = 'black';
const defaultBgColor = 'Gainsboro';

export class ConsoleCollector {
    collect(schema, data) {
        let label, color, bgColor;
        if (schema.namespace === 'sf.instrumentation') {
            label = schema.name;
            color = colorMap[schema.name] || defaultColor;
            bgColor = bgColorMap[schema.name] || defaultBgColor;
        } else {
            label = `${schema.namespace}.${schema.name}`;
            color = defaultColor;
            bgColor = defaultBgColor;
        }
        const css = `color:${color};background-color:${bgColor}`;
        console.log(
            `%cO11YSAMPLE%c ${label}`,
            'color:white;background-color:#FF6600;font-weight:bold',
            css,
            data
        );
    }
}
