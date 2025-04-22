import { Loader2 } from 'lucide-react';

const Spinner = ({ size = '24', className = '', show = true }) => {
    if (!show) return null;

    return (
        <div className={`flex justify-center items-center ${className}`}>
            <Loader2 className={`animate-spin`} size={size} />
        </div>
    );
};

export default Spinner;
