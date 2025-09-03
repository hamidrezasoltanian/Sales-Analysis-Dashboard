
// A very simple markdown to HTML converter for Gemini responses.
export const renderMarkdown = (text: string): string => {
    let html = text
        // Escape HTML to prevent XSS
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        // Bold **text**
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic *text* or _text_
        .replace(/_([^_]+)_/g, '<em>$1</em>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        // Unordered list items * item or - item
        .replace(/^\s*[\*-]\s+(.*)/gm, '<li>$1</li>');
    
    // Wrap consecutive list items in <ul>
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

    // Replace newlines with <br> for non-list items. This is tricky.
    // We avoid adding <br> inside or right next to list tags.
    html = html
        .replace(/<\/li>\n/g, '</li>')
        .replace(/\n<ul>/g, '<ul>')
        .replace(/\n/g, '<br />');

    // Clean up extra breaks around lists
    html = html.replace(/<br \/><ul>/g, '<ul>').replace(/<\/ul><br \/>/g, '</ul>');
    
    return html;
};