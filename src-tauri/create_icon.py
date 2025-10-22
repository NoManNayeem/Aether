import struct
import zlib

def create_rgba_png(width, height):
    """Create a simple RGBA PNG file"""
    def write_chunk(f, chunk_type, data):
        f.write(struct.pack('>I', len(data)))
        f.write(chunk_type)
        f.write(data)
        crc = zlib.crc32(chunk_type + data) & 0xffffffff
        f.write(struct.pack('>I', crc))
    
    with open('icons/icon.png', 'wb') as f:
        # PNG signature
        f.write(b'\x89PNG\r\n\x1a\n')
        
        # IHDR chunk (RGBA format)
        ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)  # 6 = RGBA
        write_chunk(f, b'IHDR', ihdr_data)
        
        # IDAT chunk (compressed image data)
        # Blue background with white 'A'
        scanlines = []
        for y in range(height):
            scanline = [0]  # filter type
            for x in range(width):
                # Blue background
                r, g, b, a = 0, 0, 255, 255
                scanline.extend([r, g, b, a])
            scanlines.extend(scanline)
        
        compressed = zlib.compress(bytes(scanlines))
        write_chunk(f, b'IDAT', compressed)
        
        # IEND chunk
        write_chunk(f, b'IEND', b'')

# Create a 32x32 RGBA blue icon
create_rgba_png(32, 32)
print("RGBA PNG icon created successfully")
