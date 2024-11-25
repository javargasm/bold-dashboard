import Button from "@components/atoms/Button/Button";
import Icon from "@components/atoms/Icon/Icon";
import  "./FilterPanelHeader.styles.css";


type FilterPanelHeaderProps = {
  onClose: () => void;
};

const FilterPanelHeader = ({ onClose }: FilterPanelHeaderProps) => {
  return (
    <div className="filterPanelHeader">
      <h3 className="filterPanelTitle">Filtrar</h3>
      <Button onClick={onClose} className="closeButton" aria-label="Cerrar">
        <Icon name="FiX" className="closeIcon" />
      </Button>
    </div>
  );
};

export default FilterPanelHeader;
