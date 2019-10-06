export function disabledStyleWrapper(disabled, style) {
    return disabled ? {
        ...style,
        pointerEvents: 'none',
        opacity: 0.4
    } : style;
}
